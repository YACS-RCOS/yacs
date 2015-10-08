class Semester < ActiveRecord::Base
	default_scope order(season: :desc)
end