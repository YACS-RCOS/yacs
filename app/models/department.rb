class Department < ActiveRecord::Base
  belongs_to :school
  has_many   :courses, dependent: :destroy
  validates  :code, presence: true, uniqueness: true
  validates  :name, presence: true, uniqueness: true
  default_scope { order(code: :asc) }
end
