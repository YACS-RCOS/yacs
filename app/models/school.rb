class School < ActiveRecord::Base
  has_many  :departments, dependent: :destroy
  # every school has a shortname (abbreviation) and full name.
  # abbreviations are not necessarily unique but full names are
  validates :shortname, presence: true, uniqueness: false
  validates :longname, presence: true, uniqueness: true
end
