class Api::V5::DepartmentsController < Api::V5::ApiController
  caches_page :index, if: Proc.new { |c| c.request.format.xml? }
  def index
    # this will be removed as we transition away from the old xml apis
    @departments = Department.where school_id: nil
    @schools = School.all
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
