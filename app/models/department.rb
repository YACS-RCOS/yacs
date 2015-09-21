class Department < ActiveRecord::Base
	has_many :courses
end