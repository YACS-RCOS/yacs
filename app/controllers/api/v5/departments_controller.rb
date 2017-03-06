class Api::V5::DepartmentsController < Api::V5::ApiController
  def index
    filter_model Department
    filter_any :id, :school_id, :name, :code
    if @show_courses
      query.includes! :courses
      query.includes! courses: [:sections] if @show_sections
    end
  end
end
