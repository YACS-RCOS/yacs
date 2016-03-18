class Api::V5::DepartmentsController < Api::V5::ApiController
  def index
    # this will be removed as we transition away from the old xml apis
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
    # new json api
    if params[:id].present?
      @departments_ = Department.where id: params[:id].split(',')
    elsif params[:school_id].present?
      @departments_ = Department.where school_id: params[:school_id].split(',')
    else
      @departments_ = Department.all
    end
    respond_to do |format|
      format.xml { render xml: @courses }
      format.json { render }
    end
  end
end
