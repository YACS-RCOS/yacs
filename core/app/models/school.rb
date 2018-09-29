class School < ActiveRecord::Base
  has_many  :subjects, dependent: :destroy
  validates :longname, presence: true, uniqueness: true
end
