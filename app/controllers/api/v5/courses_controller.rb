class Api::V5::CoursesController < Api::V5::ApiController
  def index
    if params[:department_id].present?
      @courses = Course.where(department_id: params[:department_id])
    elsif params[:search]
      search = params[:search].gsub(/[^0-9a-z\s]/i, '')
      @courses = Course.search(search)
    else
      @courses = Course.all
    end
    respond_to do |format|
      format.xml { render xml: @courses }
      format.json { render }
    end
  end

  def show
    @course = Course.find(params[:id])
  end
end