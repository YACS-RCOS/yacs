xml.instruct!
xml.tag! 'courses' do
  @courses.each do |course|
    xml.tag! 'course' do
      xml.tag! 'course-id', course.id
      xml.tag! 'course-name', course.name
      xml.tag! 'department-code', course.department.code
      xml.tag! 'course-number', course.number
      xml.tag! 'course-credits', course.min_credits == course.max_credits ? "#{course.min_credits}" : "#{course.min_credits}-#{course.max_credits}"
      xml.tag! 'course-description', course.description
      xml.tag! 'sections' do
        course.sections.each do |section|
          xml.tag! 'section' do
            xml.tag! 'section-id', section.id
            xml.tag! 'section-name', section.name
            xml.tag! 'section-instructors', section.instructors.join(", ")
            xml.tag! 'section-crn', section.crn
            xml.tag! 'section-seats', section.seats
            xml.tag! 'section-seats-taken', section.seats_taken
            xml.tag! 'section-seats-available', section.seats - section.seats_taken
            xml.tag! 'periods' do
              p = 0
              while p < section.num_periods
                xml.tag! 'period' do
                  xml.tag! 'period-day', section.periods_day[p]
                  xml.tag! 'period-start', section.periods_start[p]
                  xml.tag! 'period-end', section.periods_end[p]
                  xml.tag! 'period-type', section.periods_type[p]
                end
                p += 1
              end
            end
          end
        end
      end
    end
  end
end