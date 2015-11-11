class Api::V5::CoursesController < Api::V5::ApiController
  def index
    if params[:department_id].present?
      @courses = Course.where(department_id: params[:department_id])
    end
    elsif params[:q].present?
      # TODO search goes here?
    end
  end
end