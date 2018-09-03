class Instructor < ActiveRecord::Base
  validates :longname, presence: true
end
