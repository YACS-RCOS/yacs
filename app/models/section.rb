# == Schema Information
#
# Table name: sections
#
#  id            :integer          not null, primary key
#  name          :string           not null
#  crn           :integer          not null
#  course_id     :integer          not null
#  seats         :integer          not null
#  seats_taken   :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  num_periods   :integer          default(0), not null
#  periods_day   :integer          default([]), not null, is an Array
#  periods_start :integer          default([]), not null, is an Array
#  periods_end   :integer          default([]), not null, is an Array
#  periods_type  :string           default([]), not null, is an Array
#  instructors   :string           default([]), not null, is an Array
#

class Section < ActiveRecord::Base
  include ActiveRecord::Diff
  diff exclude: [:created_at, :updated_at]
  
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
