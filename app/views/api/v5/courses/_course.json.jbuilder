json.(course, :id, :name, :number, :credits, :description)
json.department_code course.department.code
json.sections course.sections, partial: '/api/v5/sections/section', as: :section