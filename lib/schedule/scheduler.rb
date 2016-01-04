class Schedule::Scheduler
  def self.one_schedule(sections) # placeholder-ish method
    courses = []
    schedules = [[]]
    sections.each do |s|
      schedules[0] << s unless courses.include? s.course
      courses << s.course
    end
    schedules
  end
end