class Department < ActiveRecord::Base
  belongs_to :school
  # department now has many subjects
  has_many   :subjects, dependent: :destroy
  # shortname and longname instead of name and code
  validates  :shortname, presence: true, uniqueness: true
  validates  :longname, presence: true, uniqueness: true
  default_scope { order(shortname: :asc) }
end
