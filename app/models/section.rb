class Section < ActiveRecord::Base
  belongs_to :course
  validates  :name, presence: true, uniqueness: { scope: :course_id }
  validates  :crn, presence: true, uniqueness: true
  default_scope { order(name: :asc) }
  after_save :update_conflicts

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

  def conflicts
    Redis.current.smembers id
  end

  private

  def update_conflicts
     reload
     Section.where.not(course_id: course_id).each do |section|
      if conflicts_with section
        Redis.current.sadd id, section.id
        Redis.current.sadd section.id, id
      else
        Redis.current.srem id, section.id
        Redis.current.srem section.id, id
      end
    end
  end
end
