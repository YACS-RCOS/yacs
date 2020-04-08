require 'json-diff'
require_relative 'concurrent_helper'


class SourceDiffer

  def initialize schema
    @schema = schema
  end

  # Performs a diff operation
  #
  # @param [Hash<String, Array<Hash>>] before the earlier data from the source
  # @param [Hash<String, Array<Hash>>] after the later data from the source
  def diff before, after
    @schema.type_names.each do |type_name|
      if before[type_name] || after[type_name]
        diff_collection (before[type_name] || []), (after[type_name] || [])
      end
    end
  end

  def diff_collection before_collection, after_collection, type_name
    upserts = detect_upserts before_collection, after_collection, type_name

    children = upserts.map do |br_ar|
      br, ar = br_ar
      
    end



    removals = detect_removals before_collection, after_collection, type_name
    changes = upserts.concat(children).concat(removals)

    changes.each do |ar|
      ar.
    end
  end

  def detect_upserts before_collection, after_collection, type_name
    upserts = after_collection.map do |ar|
      br = before_collection.find {|br| records_equal ar, br, type_name}
      [br, ar]
    end
  end

  def detect_removals before_collection, after_collection, type_name
    before_collection.select do |br|
      after_collection.none? {|ar| records_equal ar, br, type_name}
    end.map do |br|
      ar = br.merge { 'removed' => true }
      [br, ar]
    end
  end

  def strip_relatives record, type_name
    @schema.get(type_name).related.each {|field| record.delete field}
  end

  def event_for_change before_record, after_record, type_name
    before_record ||= {}
    after_record ||= {}
    updated_fields = after_record.to_a - before_record.to_a
    if after_record.present? && !before_record.present?
      ChangeEvent.new schema, after_record
    elsif after_record.present && before_record.present?

    elsif !after_record.present && before_record.present?
      after_record
    end
  end

  def records_equal a, b, type_name
    @schema.get(type_name).key.none? do |key|
      a[key] != b[key]
    end
  end

  def create_change_from_json_patch

  end
end
