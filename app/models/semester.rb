class Semester < ActiveRecord::Base
  has_many :semester_courses

	default_scope { order(season: :desc) }
end
