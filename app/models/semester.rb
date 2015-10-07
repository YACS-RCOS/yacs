class Semester < ActiveRecord::Base
	has_many :section
	has_many :courses, through: :sections

	default_scope order(season: :desc)
end