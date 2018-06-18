class Instructor < ActiveRecord::Base
  has_and_belongs_to_many :section
  validates :longname, presence: true
end
