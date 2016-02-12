json.courses @courses do |course|
  json.(course, :id, :name, :number, :credits, :description)
  json.department_code course.department.code
  json.partial! '/api/v5/sections/sections', sections: course.sections
end