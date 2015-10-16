class Professor < ActiveRecord::Base
	has_many :period_professors
  has_many :periods, through: :period_professors
end