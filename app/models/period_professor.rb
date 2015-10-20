class PeriodProfessor < ActiveRecord::Base
  belongs_to :period
  belongs_to :professor
end
