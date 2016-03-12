class Api::V5::SchoolsController < Api::V5::ApiController
  def index
    if params[:id].present?
      @schools = School.where id: params[:id].split(',')
    else
      @schools = School.all
    end
    respond_to do |format|
      format.xml { render xml: @schools }
      format.json { render }
    end
  end
end