xml.instruct!
xml.tag! 'courses' do
  @courses.each do |course|
    xml.tag! 'course' do
      xml.tag! 'course-id', course.id
      xml.tag! 'course-name', course.name
      xml.tag! 'department-code', course.department.code
      xml.tag! 'course-number', course.number
      xml.tag! 'course-credits', course.min_credits == course.max_credits ? "#{course.min_credits}" : "#{course.min_credits}-#{course.max_credits}"
      xml.tag! 'sections' do
        course.sections.each do |section|
          xml.tag! 'section' do
            xml.tag! 'section-id', section.id
            xml.tag! 'section-name', section.name
            xml.tag! 'section-instructors', section.instructors.join(", ")
            xml.tag! 'section-crn', section.crn
            xml.tag! 'section-seats', section.seats
            xml.tag! 'section-seats-taken', section.seats_taken
          end
        end
      end
    end
  end
end