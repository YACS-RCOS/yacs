class Api::V5::SchedulesController < Api::V5::ApiController
  def index
    if params[:section_ids].present?
      sections = Section.find params[:section_ids].split(',')
    else
      sections = []
    end
    @schedules = Scheduler.all_schedules sections
    respond_to do |format|
      format.xml { render xml: @schedules }
      format.json { render }
    end
  end
end