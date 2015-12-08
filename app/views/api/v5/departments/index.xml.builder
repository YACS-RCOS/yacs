xml.instruct!
xml.tag! 'schools' do
  if @schools.present?
    @schools.each do |school|
      xml.tag! 'school' do
        xml.tag! 'school-id', school.id
        xml.tag! 'school-name', school.name
        xml.tag! 'departments' do
          school.department.each do
            xml.tag! 'department' do
              xml.tag! 'department-id', department.id
              xml.tag! 'department-code', department.code
              xml.tag! 'department-name', department.name
            end
          end
        end
      end
    end
  end
end
xml.tag! 'departments' do
  if @departments.present?
    @departments.each do |department|
      xml.tag! 'department' do
        xml.tag! 'department-id', department.id
        xml.tag! 'department-code', department.code
        xml.tag! 'department-name', department.name
      end
    end
  end
end