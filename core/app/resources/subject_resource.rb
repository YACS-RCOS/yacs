class SubjectResource < ApplicationResource
  include UuidFilterable

  belongs_to :school
  has_many :courses

  attribute :shortname, :string
  attribute :longname, :string
  attribute :school_id, :integer, only: [:filterable]
end
