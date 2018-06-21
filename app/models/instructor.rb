class Instructor < ActiveRecord::Base
  has_and_belongs_to_many :sections
  validates :longname, presence: true
end
