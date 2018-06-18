class School < ActiveRecord::Base
  has_many  :departments, dependent: :destroy
  validates :longname, presence: true, uniqueness: true
end
