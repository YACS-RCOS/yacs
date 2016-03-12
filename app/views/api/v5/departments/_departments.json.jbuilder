json.departments departments do |department|
  json.(department, :id, :code, :name)
  if @show_courses
    json.partial! '/api/v5/courses/courses', courses: department.courses
  end
end