class Section < ActiveRecord::Base
  belongs_to  :semester_course
  has_many    :periods
  has_many    :period_professors, through: :periods
end