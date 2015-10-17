class Professor < ActiveRecord::Base
	has_and_belongs_to_many :periods

  scope :name_like, ->(sub) { where("name LIKE ?", sub) }
end