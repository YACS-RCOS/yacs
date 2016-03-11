class Api::V5::DepartmentsController < Api::V5::ApiController
  def index
    # this will be removed as we transition away from the old xml apis
    if params[:use_schools] != 'false'
      @departments = Department.where school_id: nil
      @schools = School.all
    else
      @departments = Department.all
    end
    # new json api
    @show_courses = params[:show_courses].present?
    if params[:id].present?
      @departments_ = Department.where id: params[:id].split(',')
    elsif params[:school_id].present?
      @departments_ = Department.where school_id: params[:school_id].split(',')
    else
      @departments_ = Department.all
    end
    respond_to do |format|
      format.xml { render xml: @departments }
      format.json { render }
    end
  end
end
