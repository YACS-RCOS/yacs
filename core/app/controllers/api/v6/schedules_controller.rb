class Api::V6::SchedulesController < Api::V6::ApiController
  def index
    schedules = ScheduleResource.all(params)
    respond_with(schedules)
  end
end
