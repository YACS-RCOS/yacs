xml.instruct!
xml.yacs_schools do
  if @schools.present?
    @schools.each do |school|
      xml.yacs_school do
        xml.yacs_school_id school.id
        xml.yacs_school_name school.name
        xml.yacs_departments do
          school.department.each do
            xml.yacs_department do
              xml.yacs_department_id department.id
              xml.yacs_department_code department.code
              xml.yacs_department_name department.name
            end
          end
        end
      end
    end
  end
end
xml.yacs_departments do
  if @departments.present?
    @departments.each do |department|
      xml.yacs_department do
        xml.yacs_department_id department.id
        xml.yacs_department_code department.code
        xml.yacs_department_name department.name
      end
    end
  end
end