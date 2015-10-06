class Course < ActiveRecord::Base
	belongs_to :department
	has_many :sections
end