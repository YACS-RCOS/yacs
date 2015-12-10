class School < ActiveRecord::Base
  has_many :departments
  # default_scope { order(name: :asc) }
end