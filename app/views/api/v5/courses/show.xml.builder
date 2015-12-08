xml.instruct!
xml.yacs_course do
  xml.yacs_course_id @course.id
  xml.yacs_course_name @course.name
  xml.yacs_course_number @course.number
  xml.yacs_course_credits @course.min_credits == @course.max_credits ? "#{@course.min_credits}" : "#{@course.min_credits}-#{@course.max_credits}"
  xml.yacs_department_code @course.department.code
  xml.yacs_sections do
    @course.sections.each do |section|
      xml.yacs_section do
        xml.yacs_section_id section.id
        xml.yacs_section_name section.name
        xml.yacs_section_crn section.crn
        xml.yacs_section_seats section.seats
        xml.yacs_section_seats_taken section.seats_taken
      end
    end
  end
end