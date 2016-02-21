class Api::V5::CoursesController < Api::V5::ApiController
  def index
    if params[:department_id].present?
      @courses = Course.where department_id: params[:department_id]
    elsif params[:id].present?
      @courses = Course.find params[:id].split(',')
    elsif params[:search].present?
      @courses = Course.search params[:search].split(',')
    else
      @courses = Course.all
    end
    respond_to do |format|
      format.xml { render xml: @courses }
      format.json { render }
    end
  end
end