class Api::V5::DepartmentsController < Api::V5::ApiController
  def index
    if params[:use_schools] != 'false'
      @departments = Department.where school_id: nil
      @schools = School.all
    else
      @departments = Department.all
    end
    respond_to do |format|
      format.xml { render xml: @courses }
      format.json { render }
    end
  end

  def show
    @department = Department.find(params[:id])
  end
end
