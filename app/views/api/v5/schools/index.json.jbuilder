json.schools @schools do |school|
  json.(school, :id, :name)
  if @show_departments
    json.partial! '/api/v5/departments/departments', departments: school.departments, show_courses: false
  end
end