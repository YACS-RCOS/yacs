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

  sort :course_shortname, :string do |scope, direction|
    scope.order('courses.shortname asc')
  end

  filter :subject_id, :integer do
    eq do |scope, value|
      scope.where({ courses: { subject_id: value } })
    end
  end

  filter :latest, :boolean do
    eq { |scope, value| scope.latest(value) }
  end

  filter :search, :string do
    eq { |scope, value| scope.matches_search(value.first) }
  end

  def base_scope
    Listing.eager_load({ course: :subject })
  end
end
