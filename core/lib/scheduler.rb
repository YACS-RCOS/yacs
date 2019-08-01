class Scheduler
  def self.all_schedules(sections)
    params = expand_listings(sections)
    schedules = []
    search(params, schedules)
    sort_schedules(0, schedules)
  end

  def self.search(params, schedules, schedule=[])
    return if params.size == 0 or schedules.size > 999
    if schedule.size < params.size
      params[schedule.size].each do |new_section|
        conflict = false
        schedule.each do |last_section|
          if new_section.conflicts_with(last_section)
            conflict = true
            break
          end
        end
        if not conflict
          next_schedule = Array.new(schedule) << new_section
          search(params, schedules, next_schedule)
        end
      end
    else
      schedule.find_average_start()
      schedule.find_average_finish()
      schedules << schedule
    end
  end

  def self.sort_schedules(sort_parameter, schedules)
      case sort_parameter
      when 1
          schedules.sort_by.reverse { |this_schedule| this_schedule.average_start }
      when 2
          schedules.sort_by { |this_schedule| this_schedule.average_finish }
      else
          schedules
      end
  end

  def self.schedule_valid?(schedule) #unoptimized
    schedule.each_with_index do |s1, i|
      schedule.each_with_index do |s2, j|
        return false if i != j and s1.conflicts_with(s2)
      end
    end
    true
  end

  def self.expand_listings(sections)
    sections.reject { |s| s.periods.count == 0 }.group_by(&:listing_id).values
  end
end
