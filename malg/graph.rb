require 'oj'
require 'redis'
require 'thread'
require 'securerandom'
require 'active_support'
require 'active_support/core_ext'
require_relative 'event_transport'

class Graph
  attr_reader :graph

  def initialize uni_shortname, term_shortname, priorities, schema, transport
    @uni_shortname = uni_shortname
    @term_shortname = term_shortname
    @priorities = priorities
    @schema = schema
    @transport = transport
    @graph = empty_graph []
    @sources = {}
    @state = :uninitialized
    @unresolvable = []
    @semaphore = Mutex.new
  end

  def update_from_source source
    if source.data.nil? || source.data.empty?
      STDERR.puts "ERROR: Null data from source #{source.name}"
      return
    end
    reset_sweepers
    type = source.data.first[0]
    handle_collection source.data[type], type, source, nil
    sweep_extant_records
    write_state
  end

  def load
    raise "ERROR: Cannot load an initialized Graph" if @state != :uninitialized
    @state = :initializing
    @semaphore.synchronize do
      state = read_state
      if state
        @graph = state['graph']
        @sources = state['sources']
        @state = :initialized
        true
      else
        STDERR.puts 'WARNING: Unable to read state'
        @state = :uninitialized
        false
      end
    end
  end

  def build sources
    raise "ERROR: Cannot build an initialized Graph" if @state != :uninitialized
    @state = :initializing
    @semaphore.synchronize do
      until can_build_graph? sources
        STDERR.puts 'WARNING: Missing existence sources. Cannot build graph. Will try again...'
        sleep 5
      end
      order_by_existence_hierarchy sources
      sources.each { |source| update_from_source source }
      @state = :initialized
      print_status
    end
  end

  def update source
    return if @state == :uninitialized
    @semaphore.synchronize do
      STDERR.puts "DEBUG: Update from source #{source.name}"
      update_from_source source
    end
  end

  private

  def next_uuid
    SecureRandom.uuid
  end

  def can_build_graph? sources
    # TODO: This is a bit of a hack to avoid a race condition. Ideally, the graph
    #       should be able to be initialized with only the existential sources,
    #       but we need some sort of update queue or semaphore to make sure updates
    #       from late-loading sources are not either lost or executed before the
    #       graph has been initialized. So as a quick fix, we delay initialization
    #       until all sources are ready, and ignore updates until initialization
    #       is completed.
    #       
    ready_sources = sources.map { |source| source.name if source.has_data }.compact
    (@priorities.existence_sources - ready_sources).empty?
    # sources.all? &:has_data
  end

  def empty_graph value
    @schema.type_names.map { |type| [type, value.try(:dup) || value] }.to_h
  end

  def order_by_existence_hierarchy sources
    @schema.type_names.reverse.each do |type|
      existence_source = @priorities.existence_source_for_type type

      existence_index = sources.index { |source| source.name == existence_source }
      unless existence_index
        raise "ERROR: Existence source #{existence_source} missing for type #{type}"
      end
      sources.unshift sources.delete_at(existence_index)
    end
  end

  def add_record record, type, source, parent
    raise 'Nil Parent Error' if parent == nil && @schema.parent_type_for(type)
    new_record = record.except @schema.child_type_for type
    new_record['uuid'] = next_uuid
    @sources[new_record['uuid']] = new_record.transform_values { |v| source }
    @sources[new_record['uuid']]['uuid'] = Priorities::FIXED
    @graph[type] << new_record
    if parent
      parent[type] ||= []
      parent[type] << new_record
      parent_type = @schema.singularize(@schema.parent_type_for(type))
      parent_uuid_field = "#{parent_type}_uuid"
      parent_identifier = @schema.identifier_for(@schema.parent_type_for(type))
      new_record[parent_uuid_field] = parent['uuid']
      new_record["#{parent_type}_#{parent_identifier}"] = parent[parent_identifier]
      @sources[new_record['uuid']][parent_uuid_field] = Priorities::FIXED
    end
    @transport.dispatch 'create', new_record, type
    new_record
  end

  def ammend_record old_record, new_record, type, new_source
    record_changed = false
    new_record.except(@schema.child_type_for type).each do |k, v|
      old_source = @sources[old_record['uuid']][k]
      p1 = @priorities.get type, k, new_source
      p2 = @priorities.get type, k, old_source
      if p1 <= p2
        @sources[old_record['uuid']][k] = new_source
        if old_record[k] != v
          #STDERR.puts "DEBUG: Updated field #{k} of #{type} #{old_record['uuid']} | Value: #{old_record[k]} -> #{v} | Source: #{old_source} -> #{new_source}" if @initialized
          old_record[k] = v
          record_changed = true
        end
      end
    end
    if record_changed && !old_record['removed']
      @transport.dispatch 'update', old_record, type
    end
    old_record
  end

  def remove_record record, type
    @graph[type].delete record
    child_type = @schema.child_type_for type
    @transport.dispatch 'delete', record, type
    STDERR.puts "DEBUG: Removed #{type} #{record['uuid']}"
    record[child_type].each { |child| remove_record child, child_type } if record[child_type]
  end

  def find_matching_record record, type, collection
    return nil unless collection
    collection.detect do |collection_record|
      id_field = @schema.identifier_for type
      collection_record[id_field] == record[id_field]
    end
  end

  def handle_record record, type, source, parent
    if parent
      old_record = find_matching_record record, type, parent[type]
      if old_record
        return ammend_record old_record, record, type, source.name
      elsif @priorities.existence_source_for_type(type) == source.name
        return add_record record, type, source.name, parent
      end
    else
      old_record = find_matching_record record, type, @graph[type]
      if old_record
        return ammend_record old_record, record, type, source.name
      elsif type == 'schools'
        return add_record record, type, source.name, nil
      else
        # TODO: Throw error if it's the existence source and debug otherwise
        # STDERR.puts "WARNING: Unresolvable #{type} #{record} from source #{source.name}"
        @unresolvable << record
        return nil
      end
    end
  end

  def handle_collection collection, type, source, parent
    handle_delete = @priorities.existence_source_for_type(type) == source.name
    records = collection.map do |source_record|
      record = handle_record source_record, type, source, parent
      # if handle_delete && record['removed']
      #   undelete_record record
      # end

      child_type = @schema.child_type_for type
      if child_type && source_record[child_type]
        handle_collection source_record[child_type], child_type, source, record
      end
      record
    end
    if handle_delete
      flag_as_extant records, type
      @extant_records[type].concat records
      @sweep_flags[type] = true
    end
    records
  end

  def flag_as_extant records, type
    @extant_records[type].concat records
    @sweep_flags[type] = true
  end

  def sweep_extant_records
    @sweep_flags.each do |type, should_sweep|
      if should_sweep
        (@graph[type] - @extant_records[type]).each do |removed_record|
          # STDERR.puts "DEBUG: Removed #{type} #{removed_record['uuid']} at source #{source.name}"
          remove_record removed_record, type
        end
      end
    end
  end

  def reset_sweepers
    @extant_records = empty_graph []
    @sweep_flags = empty_graph false
  end

  def print_status
    STDERR.puts "Status:"
    @graph.each do |k, v|
      STDERR.puts "Resolved #{v.count} #{k}"
    end
    STDERR.puts "Failed to resolve #{@unresolvable.count} records:"
    STDERR.puts @unresolvable
  end

  def read_state
    begin
      raw_state = Redis.current.get state_key
      state = Oj.load raw_state

      raise 'Invalid state error' unless state.present? \
        && state['sources'].present? && state['sources'].is_a?(Hash) \
        && state['graph'].present? && state['graph'].is_a?(Hash) \
        && @schema.type_names.all? do |type|
          state['graph'][type] && state['graph'][type].is_a?(Array)
        end
      state
    rescue
      nil
    end
  end

  def state_key
    "#{@uni_shortname}/malg_state/term/#{@term_shortname}/graph"
  end

  def write_state
    # binding.pry
    Redis.current.set state_key, { graph: @graph, sources: @sources }.to_json
  end
end
