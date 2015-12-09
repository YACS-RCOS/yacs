class Course < ActiveRecord::Base
  belongs_to  :department
  has_many    :sections
  validates :name, :number, uniqueness: { scope: :department_id }
end
