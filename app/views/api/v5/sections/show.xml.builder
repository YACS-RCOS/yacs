xml.instruct!
xml.tag! 'section' do
  xml.tag! 'section-id', @section.id
  xml.tag! 'section-name', @section.name
  xml.tag! 'section-crn', @section.crn
  xml.tag! 'section-course-id', @section.course_id
  xml.tag! 'section-seats', @section.seats
  xml.tag! 'section-seats-taken', @section.seats_taken
  xml.tag! 'periods' do
    @section.periods.each do |period|
      xml.tag! 'period-id', @period.id
      xml.tag! 'period-time', @period.time
      xml.tag! 'period-type', @period.period_type
      xml.tag! 'period-location', @period.location
    end
  end
end
