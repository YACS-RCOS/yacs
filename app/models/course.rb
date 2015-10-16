class Course < ActiveRecord::Base
  belongs_to  :department
  has_many    :semester_courses
end
