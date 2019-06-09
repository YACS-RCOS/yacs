require 'activesupport/core_ext'
require_relative 'concurrent_helper'
require_relative 'logging'

class Schema
  include Concurrent::Promises::CustomHelpers
  include Schema::HelperMethods
  include Logging

  def initialize config
    @types = sanitize(config[:types]).map do |type_name, type_config|
      [name, Schema::Type.new type_name, type_config]
    end.to_h.with_indifferent_access.freeze
  end

  def type_names
    @types.keys
  end

  def get name
    @types[name]
  end
end

class Schema::Type
  include Schema::HelperMethods

  attr_reader :name, :has_many, :belongs_to, :key

  def initialize name, config
    @name = name.freeze
    @has_many = Schema.sanitize config[:has_many]
    @belongs_to = Schema.sanitize config[:belongs_to]
    @key = Schema.sanitize config[:key]

    log_raise :error, :invalid_schema, 'schema must have at least one entry for :key' unless @key.present?
  end

  def related
    @has_many + @belongs_to
  end

  def log_fields
    { type: { name: @name, key: @key, has_many: @has_many, belongs_to: @belongs_to } }
  end
end

module Schema::HelperMethods
  def sanitize values
    Array.wrap(values).compact.uniq.freeze
  end
end
