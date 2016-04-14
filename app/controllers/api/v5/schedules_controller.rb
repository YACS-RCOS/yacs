class Api::V5::SchedulesController < Api::V5::ApiController
  def index
    if params[:section_ids].present?
      sections = Section.find any :section_ids
    else
      sections = []
    end
    @schedules = Scheduler.all_schedules sections
  end
end