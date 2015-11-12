class Api::V5::CoursesController < Api::V5::ApiController
  def index
    if params[:department_id].present?
      @courses = Course.where(department_id: params[:department_id])
    else
      @courses = Course.all
    end
    if params[:q].present?
      # search here
    end
  end

  def show
    @course = Course.find(params[:id])
  end
end