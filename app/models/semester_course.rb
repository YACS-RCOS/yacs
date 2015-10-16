class SemesterCourse < ActiveRecord::Base
  belongs_to  :semester
  belongs_to  :course
  has_many    :sections
  has_many    :professors, through: :sections
end