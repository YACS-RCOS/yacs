json.schedules @schedules do |schedule|
  json.sections schedule do |section|
    json.extract! section, :id, :name, :crn, :course_id, :seats, :seats_taken, :num_periods, :periods_type, :periods_day, :periods_start, :periods_end
    json.instructors section.instructors.join(", ")
    json.seats_available section.seats - section.seats_taken
  end
end