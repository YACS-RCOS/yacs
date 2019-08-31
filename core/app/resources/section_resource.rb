class SectionResource < ApplicationResource
  include UuidFilterable

  belongs_to :listing

<<<<<<< HEAD
  attribute :shortname, :string
  attribute :crn, :string
  attribute :seats, :integer
  attribute :seats_taken, :integer
  attribute :conflict_ids, :array
  attribute :periods, :array
  attribute :instructors, :array
  attribute :listing_id, :integer, only: [:filterable]
  attribute :status, :string
=======
  attribute :shortname, :string, writable: true
  attribute :crn, :string, writable: true
  attribute :seats, :integer, writable: true
  attribute :seats_taken, :integer, writable: true
  attribute :conflict_ids, :array, writable: true
  attribute :periods, :array, writable: true
  attribute :instructors, :array, writable: true
  attribute :listing_id, :integer, only: [:filterable], writable: true
>>>>>>> 260e0ecf3c26721ef7b8eef87576767f6f21dd34
end
