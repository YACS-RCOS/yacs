xml.instruct!
xml.yacs_section do
  xml.yacs_section_id @section.id
  xml.yacs_section_name @section.name
  xml.yacs_section_crn @section.crn
  xml.yacs_section_course_id @section.course_id
  xml.yacs_section_seats @section.seats
  xml.yacs_section_seats_taken @section.seats_taken
  xml.yacs_periods do
    @section.periods.each do |period|
      xml.yacs_period_id period.id
      xml.yacs_period_time period.time
      xml.yacs_period_type period.period_type
      xml.yacs_period_location period.location
    end
  end
end
