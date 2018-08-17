class CourseResource < JSONAPI::Resource
  attributes :number
  belongs_to :subject
  has_many   :listings
end
