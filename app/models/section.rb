class Section < ActiveRecord::Base
  belongs_to :course
  validates  :name, presence: true, uniqueness: { scope: :course_id }
  validates  :crn, presence: true, uniqueness: true
  default_scope { order(name: :asc) }
  before_save :sort_periods, if: :periods_changed?

  def conflicts_with(section)
    i = 0
    while i < num_periods
      j = 0
      while j < section.num_periods
        if (periods_day[i] == section.periods_day[j] \
          && ((periods_start[i] <= section.periods_start[j] && periods_end[i] >= section.periods_start[j]) \
          || (periods_start[i] >= section.periods_start[j] && periods_start[i] <= section.periods_end[j])))
          return true
        end
        j += 1
      end
      i += 1
    end
    false
  end

  def sort_periods
    periods_info = periods_day.zip periods_start, periods_end, periods_type
    periods_info = periods_info.sort!.transpose
    self.periods_day, self.periods_start, self.periods_end, self.periods_type = periods_info
  end

  def periods_changed?
    (self.changed & %w(periods_start periods_end periods_day periods_type)).any?
  end
end