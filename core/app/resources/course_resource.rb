class CourseResource < ApplicationResource
  belongs_to :subject
  has_many :listings

  attribute :shortname, :string
  attribute :uuid, :string
  attribute :subject_id, :integer, only: [:filterable]

  attribute :subject_shortname, :string do
    @object.subject.shortname
  end

  has_one :latest_listing, resource: ListingResource do
    params do |hash|
      hash[:filter][:latest] = true
    end
  end

  def base_scope
    Course.eager_load(:subject)
  end
end
