class Section < ActiveRecord::Base
  belongs_to  :course
  has_many    :periods
  has_many    :professors, through: :periods
end