class Api::V5::SchedulesController < Api::V5::ApiController
  def index
    sections = params[:sections].map do |id|
      Section.find(id)
    end
    @schedules = Scheduler.all_schedules(sections)
    respond_to do |format|
      format.xml { render xml: @schedules }
      format.json { render }
    end
  end
end