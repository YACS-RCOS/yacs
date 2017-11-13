require 'securerandom'
require 'active_support'

class Graph

  # class Graph
  #   attr_accessor :graph, :sources
  #   def initialize
  #     @graph = { 'schools' => [], 'departments' => [], 'courses' => [], 'sections' => [] }
  #     @sources {}
  #   end

  #   def add_record type, record, source
  #     @graph[]
  #   end
  # end
  

  DATA_TYPES = %w(schools departments courses sections).freeze
  DATA_TYPE_UIDS = { 'schools' => 'name', 'departments' => 'code', 'courses' => 'number', 'sections' => 'crn' }.freeze

  def initialize priorities, schema
    @priorities = priorities
    @schema = schema
    @graph = { 'schools' => [], 'departments' => [], 'courses' => [], 'sections' => [] }
    @sources = {}
    @initialized = false
    @unresolvable = []
  end

  def update_from_source source
    if source.data.nil? || source.data.empty?
      STDERR.puts "ERROR: Null data from source #{source.name}"
      return
    end
    # STDERR.puts 
    type = source.data.first[0]
    handle_collection source.data[type], type, source, nil
    # STDERR.puts @graph
    sleep 5
  end

  def build sources
    until can_build_graph? sources
      STDERR.puts 'WARNING: Missing existence sources. Cannot build graph. Will try again...'
      sleep 5
    end

    STDERR.puts "-------- SOURCES -------- #{sources.map &:name}"
    
    order_by_existence_hierarchy sources
    STDERR.puts "-------- SOURCES -------- #{sources.map &:name}"
    # exit
    sources.each { |source| update_from_source source }
    @initialized = true
    print_status
  end

  def print_status
    STDERR.puts "Status:"
    @graph.each do |k, v|
      STDERR.puts "Resolved #{v.count} #{k}"
    end
    STDERR.puts "Failed to resolve #{@unresolvable.count} records:"
    STDERR.puts @unresolvable
  end

  def update source
    update_from_source source if @initialized
  end

  private

  def next_uuid
    SecureRandom.uuid
  end

  def can_build_graph? sources
    # ready_sources = sources.map { |source| source.name if source.has_data }.compact
    # (@priorities.existence_sources - ready_sources).empty?
    sources.all? &:has_data
  end

  def order_by_existence_hierarchy sources
    DATA_TYPES.reverse.each do |type|
      existence_source = @priorities.existence_source_for_type type

      existence_index = sources.index { |source| source.name == existence_source }
      unless existence_index
        throw "ERROR: Existence source #{existence_source} missing for type #{type}"
      end
      sources.unshift sources.delete_at(existence_index)
    end
  end

  def add_record record, type, source, parent
    throw 'Nil Parent Error' if parent == nil && type != 'schools'
    new_record = record.except @schema.child_type_for type
    new_record['uuid'] = next_uuid
    @graph[type] << new_record
    if parent
      parent[type] ||= []
      parent[type] << new_record
    end
    @sources[new_record['uuid']] = new_record.transform_values { |v| source }
    new_record
  end

  def ammend_record old_record, new_record, type, new_source
    new_record.except(@schema.child_type_for type).each do |k, v|
      if @priorities.higher? new_source, @sources[old_record['uuid']], type, k
        old_record[k] = v
        @sources[old_record['uuid']][k] = new_source
      end
    end
    old_record
  end

  def find_matching_record record, type, collection
    return nil unless collection
    collection.detect do |collection_record|
      collection_record[DATA_TYPE_UIDS[type]] == record[DATA_TYPE_UIDS[type]]
    end
  end

  def handle_record record, type, source, parent
    if parent
      old_record = find_matching_record record, type, parent[type]
      if old_record
        return ammend_record old_record, record, type, source.name
      else
        return add_record record, type, source.name, parent
      end
    else

      old_record = find_matching_record record, type, @graph[type]
      if old_record
        return ammend_record old_record, record, type, source.name
      elsif type == 'schools'
        return add_record record, type, source, nil
      else
        STDERR.puts "Error: Unresolvable #{type} #{record} from source #{source.name}"
        @unresolvable << record
        return nil
      end
    end
  end

  def handle_collection collection, type, source, parent
    collection.map do |source_record|
      record = handle_record source_record, type, source, parent
      child_type = @schema.child_type_for type
      # STDERR.puts "+++++", child_type, source_record[child_type]
      if child_type && source_record[child_type]
        handle_collection source_record[child_type], child_type, source, record
      end
      record
    end
  end
end
