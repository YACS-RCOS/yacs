class Section < ActiveRecord::Base
  belongs_to  :course
  default_scope { order(name: :asc) }

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
end