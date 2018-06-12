class Subject < ActiveRecord::Base
  # entirely new model
  # each department has many subjects and there are many courses within a subject
  belongs_to :department
  has_many   :courses, dependent: :destroy
  # subject must have a full name and abbrevation (longname and shortname)
  validates  :shortname, presence: true, uniqueness: true
  validates  :longname, presence: true, uniqueness: true
  default_scope { order(shortname: :asc) }
end
