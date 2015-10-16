class SemesterCourse < ActiveRecord::Base
  belongs_to  :semester
  belongs_to  :course
  has_many    :sections
  has_many    :period_professors, through: :sections
end