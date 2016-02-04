json.schedules @schedules do |schedule|
  json.sections schedule do |section|
    json.extract! section, :id, :name, :crn, :course_id, :seats, :seats_taken, :num_periods
    i = 0
    json.periods section.periods_type do
      json.type section.periods_type[i]
      json.day section.periods_day[i]
      json.start section.periods_start[i]
      json.end section.periods_end[i]
      i += 1
    end
    json.instructors section.instructors.join(", ")
    json.seats_available section.seats - section.seats_taken
    json.course_name section.course.name
    json.course_number section.course.number
    json.department_code section.course.department.code
  end
end