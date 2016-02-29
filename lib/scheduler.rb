class Scheduler
  def self.all_schedules(sections)
    params = expand_courses(sections)
    schedules = []
    search(params, schedules)
    schedules
  end

  def self.search(params, schedules, schedule=[])
    return if params.size == 0
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
      schedules << schedule
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

  def self.expand_courses(sections)
    hash = {}
    sections.each do |s|
      if s.num_periods > 0
        hash[s.course] ||= []
        hash[s.course] << s
      end
    end
    hash.values
  end
end