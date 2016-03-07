# == Schema Information
#
# Table name: departments
#
#  id         :integer          not null, primary key
#  code       :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  school_id  :integer
#

class Department < ActiveRecord::Base
  belongs_to :school
  has_many :courses
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true, uniqueness: true
  default_scope { order(code: :asc) }
end
