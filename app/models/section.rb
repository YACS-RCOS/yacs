class Section < ActiveRecord::Base
  belongs_to  :course
  default_scope { order(name: :asc) }
end