class CourseResource < ApplicationResource
  belongs_to :subject
  has_many :listings

  attribute :shortname, :string
  attribute :uuid, :string
  attribute :subject_id, :integer, only: [:filterable]
end
