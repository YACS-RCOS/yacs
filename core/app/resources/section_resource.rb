class SectionResource < ApplicationResource
  include UuidFilterable

  belongs_to :listing

  attribute :shortname, :string
  attribute :crn, :string
  attribute :seats, :integer
  attribute :seats_taken, :integer
  attribute :conflict_ids, :array
  attribute :periods, :array
  attribute :instructors, :array
  attribute :listing_id, :integer, only: [:filterable]
  attribute :status, :string
end
