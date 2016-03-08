class Api::V5::DepartmentsController < Api::V5::ApiController
  def index
    if params[:use_schools] != 'false'
      Rails.cache.fetch('departments_by_school', expires_in: 2.hours) do
        @departments = Department.where school_id: nil
        @departments
      end
      @schools = School.all
    else
      Rails.cache.fetch('all_departments', expires_in: 2.hours) do
        @departments = Department.all
        @departments
      end
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
