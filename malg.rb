require 'securerandom'

class Malg

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
  DATA_TYPE_UIDS = { 'schools' => 'name', 'departments' => 'code', 'courses' => 'number', 'sections' => 'name' }.freeze

  def initialize priorities, schema
    @priorities = priorities
    @schema = schema
    @graph = { 'schools' => [], 'departments' => [], 'courses' => [], 'sections' => [] }
    @sources = {}
  end

  def update_from_source source
    type = source.root_type
    handle_collection source.data[source.root_type], source, nil
  end

  def initialize_graph
    throw 'Necessary Sources Missing' unless can_build_graph?

    priorities.sources_by_hierarchy.each do |source|
      update_from_source source
    end
  end

  private

  def next_uuid
    SecureRandom.uuid
  end

  def can_build_graph?
    priorities.vital_sources_ready?
  end

  def add_record record, type, source, parent
    throw 'Nil Parent Error' if parent == nil && type != 'schools'
    new_record = record.clone
    new_record['uuid'] = next_uuid
    @graph[type] << new_record
    if parent
      parent[type] ||= []
      parent[type] << new_record
    end
    @souces[new_record['uuid']] = new_record.transform_values { |v| source }
    new_record
  end

  def ammend_record old_record, new_record, type, new_source
    new_record.reject{ |k, v| DATA_TYPES.any? k }.each do |k, v|
      if priorities.get(type, k, new_source) > priorities.get(type, k, @sources[old_record['uuid']])
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
        puts "Error: Unresolvable #{type} #{record} from source #{source.name}"
      end
    end
  end

  def handle_collection collection, type, source, parent
    collection.map do |source_record|
      record = handle_record source_record, type, source, parent
      child_type = @schema.child_type_for type
      if child_type && source_record[child_type]
        handle_collection source_record[child_type], child_type, source, record
      end
      record
    end
  end
end
