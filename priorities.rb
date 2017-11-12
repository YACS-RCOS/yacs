require 'yaml'

class Priorities

  def initialize filename
    @config = Yaml.load_file(filename)['piorities']
    @existence = @config.map do |k, v|
      [k, v['existence']] if v['existence']
    end.compact!.uniq!.to_h
    @field_map = {}
    @config.each do |type, params|
      if type != 'default' && params['fields']
      params['fields'].each do |name, sources|
        @field_map[type] ||= {}
        @field_map[type][name] = sources
      end
    end
    @field_map.default = Hash.new @config['default']['fields']
  end

  def for_source type, field, source
    
  end

  def higher? source1, source2, type, field
    p1 = @field_map[type][field].index source1 || 999
    p2 = @field_map[type][field].index source2 || 999
    return p1 < p2
  end

  def existence_source_for_type type
    @existence[type]
  end

  def existence_sources
    @existence.values.uniq
  end
end
