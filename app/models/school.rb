class School < ActiveRecord::Base
  has_many :departments, dependent: :destroy
end