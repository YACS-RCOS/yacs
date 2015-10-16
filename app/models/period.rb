class Period < ActiveRecord::Base
  belongs_to  :section
  has_many    :period_professors
end