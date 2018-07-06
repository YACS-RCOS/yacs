class CourseSerializer
  include FastJsonapi::ObjectSerializer
  attributes :number
  belongs_to :subjects
  has_many :listings
end
