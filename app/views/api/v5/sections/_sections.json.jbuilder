json.sections sections do |section|
  json.(section, :id, :name, :crn, :seats, :seats_taken, :instructors, :num_periods, :course_id, :conflicts)
  if @show_periods
    json.periods do
      i = 0
      json.array! section.periods_type do |type|
        json.type section.periods_type[i]
        json.day section.periods_day[i]
        json.start section.periods_start[i]
        json.end section.periods_end[i]
        i += 1
      end
    end
    json.course_name section.course.name
    json.course_number section.course.number
    json.department_code section.course.department.code
  end
end
