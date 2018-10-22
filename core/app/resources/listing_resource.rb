class ListingResource < ApplicationResource
  belongs_to :course
  belongs_to :term
  has_many :sections

  attribute :longname, :string
  attribute :description, :string
  attribute :min_credits, :integer
  attribute :max_credits, :integer
  attribute :active, :boolean
  attribute :tags, :array
  # attribute :auto_attributes, :hash
  # attribute :override_attributes, :hash
  attribute :uuid, :string
  attribute :required_textbooks, :array
  attribute :recommended_textbooks, :array
  attribute :course_id, :integer, only: [:filterable]
  attribute :term_id, :integer, only: [:filterable]
end
