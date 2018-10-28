class ListingResource < ApplicationResource
  include UuidFilterable

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
  attribute :required_textbooks, :array
  attribute :recommended_textbooks, :array
  attribute :course_id, :integer, only: [:filterable]
  attribute :term_id, :integer, only: [:filterable]

  attribute :course_shortname, :string do
    @object.course.shortname
  end

  attribute :subject_shortname, :string do
    @object.course.subject.shortname
  end

  filter :latest, :boolean do
    eq { |scope, value| scope.latest(value) }
  end

  def base_scope
    Listing.eager_load({ course: :subject })
  end
end
