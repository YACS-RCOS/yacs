class PeriodsProfessor < ActiveRecord::Base
  belongs_to :period
  belongs_to :professor
end
