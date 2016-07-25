json.courses courses do |course|
  json.(course, :id, :name, :number, :min_credits, :max_credits, :description, :department_id)
  if @show_sections
    json.partial! '/api/v5/sections/sections', sections: course.sections.all
  end
end