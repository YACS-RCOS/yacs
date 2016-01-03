xml.instruct!
xml.tag! 'section' do
  xml.tag! 'section-id', @section.id
  xml.tag! 'section-name', @section.name
  xml.tag! 'section-instructors', @section.instructors.join(", ")
  xml.tag! 'section-crn', @section.crn
  xml.tag! 'course-id', @section.course_id
  xml.tag! 'section-seats', @section.seats
  xml.tag! 'section-seats-taken', @section.seats_taken
  xml.tag! 'section-seats-available', @section.seats - @section.seats_taken
  xml.tag! 'periods' do
    p = 0
    while p < @section.num_periods
      xml.tag! 'period' do
        xml.tag! 'period-type', @section.periods_type[p]
        xml.tag! 'period-day', @section.periods_day[p]
        xml.tag! 'period-start', @section.periods_start[p]
        xml.tag! 'period-end', @section.periods_end[p]
      end
      p += 1
    end
  end
end
