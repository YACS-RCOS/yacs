require 'rake'
Yacs::Application.load_tasks

class UpdateSeats
  def perform
    Rake::Task['catalog:update_seats'].invoke
  end
end

Crono.perform(UpdateSeats).every 5.minutes