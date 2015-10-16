class Section < ActiveRecord::Base
  belongs_to  :semester_course
  has_many    :periods
  has_many    :professors, through: :periods
end