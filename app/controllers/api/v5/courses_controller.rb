class Api::V5::CoursesController < Api::V5::ApiController
  def index
    if params[:department_id].present?
      @courses = Course.where(department_id: params[:department_id])
    elsif params[:search].present?
      @courses = Course.search(params[:search].split)
    else
      @courses = Course.all
    end
  end

  def show
    @course = Course.find(params[:id])
  end
end