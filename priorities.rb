require 'yaml'

class Priorities

  def initialize filename
    @config = YAML.load_file(filename)['priorities']
    @existence = @config.map do |k, v|
      [k, v['existence']] if v['existence'] && k != 'default'
    end.compact!.to_h
    @field_map = {}
    @config.each do |type, params|
      if type != 'default' && params['fields']
        params['fields'].each do |name, sources|
          @field_map[type] ||= Hash.new @config['default']['fields']
          @field_map[type][name] = sources
        end
      end
    end
    @field_map.default = Hash.new @config['default']['fields']
  end

  def get type, field, source
    @field_map[type][field].index(source) || 999
  end

  def existence_source_for_type type
    @existence[type]
  end

  def existence_sources
    @existence.values.uniq
  end
end
