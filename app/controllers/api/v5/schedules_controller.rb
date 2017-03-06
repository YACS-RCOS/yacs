class Api::V5::SchedulesController < Api::V5::ApiController
  def index
    if params[:section_ids].present?
      sections = Section.where id: any(:section_ids)
      sections.includes! :course
    else
      sections = []
    end
    @schedules = Scheduler.all_schedules sections
  end
end
