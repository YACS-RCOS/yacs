class SectionResource < ApplicationResource
  include UuidFilterable

  belongs_to :listing

  attribute :shortname, :string, writable: true
  attribute :crn, :string, writable: true
  attribute :seats, :integer, writable: true
  attribute :seats_taken, :integer, writable: true
  attribute :conflict_ids, :array, writable: true
  attribute :periods, :array, writable: true
  attribute :instructors, :array, writable: true
  attribute :listing_id, :integer, only: [:filterable], writable: true
  attribute :status, :string
end
