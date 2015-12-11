class Course < ActiveRecord::Base
  belongs_to  :department
  has_many    :sections
  validates :name, :number, uniqueness: { scope: :department_id }
  default_scope { order(number: :asc) }
end
