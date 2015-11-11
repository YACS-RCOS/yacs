class Api::V5::DepartmentsController < Api::V5::ApiController
  def index
    @departments = Department.all
  end

  def show
    @department = Department.find(params[:id])
  end
end
