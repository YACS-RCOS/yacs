require 'yaml'
require 'active_support'

class Schema
  attr_reader :types

  def initialize filename
    @types = YAML.load_file(filename)['schema']['types']
  end

  def child_type_for type
    @types[type]['child_type']
  end

  def parent_type_for type
    @types[type]['parent_type']
  end

  def type_names
    @types.keys
  end

  def identifier_for type
    @types[type]['identifier']
  end

  def singularize type
    ActiveSupport::Inflector.singularize type
  end
end