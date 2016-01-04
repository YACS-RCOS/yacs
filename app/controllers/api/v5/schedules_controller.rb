class Api::V5::SchedulesController < Api::V5::ApiController
  def index
    sections = params[:sections].map do |id|
      Section.find(id)
    end
    @schedules = Schedule::Scheduler.one_schedule(sections)
  end
end