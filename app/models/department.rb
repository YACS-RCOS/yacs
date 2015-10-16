class Department < ActiveRecord::Base
  has_many :courses
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true, uniqueness: true
end