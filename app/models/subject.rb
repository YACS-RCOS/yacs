class Subject < ActiveRecord::Base
  belongs_to :school
  has_many   :courses, dependent: :destroy
  validates  :shortname, presence: true, uniqueness: true
  validates  :longname, presence: true, uniqueness: true
  default_scope { order(shortname: :asc) }
end
