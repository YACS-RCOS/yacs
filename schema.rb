require 'yaml'

class Schema
  attr_reader :types

  def initialize filename
    @types = Yaml.load_file(filename)['types']
  end

  def child_type_for type
    @types[type]['child_type']
  end
end