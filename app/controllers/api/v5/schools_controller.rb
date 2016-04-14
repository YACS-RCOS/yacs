class Api::V5::SchoolsController < Api::V5::ApiController
  def index
    filter_model School
    filter_any :id
    if @show_departments
      query.includes(:departments)
      query.includes(departments: [:courses]) if @show_courses
    end
  end
end