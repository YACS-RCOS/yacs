require 'rake'
Yacs::Application.load_tasks

class UpdateSeats
  def perform
    Catalog::RpiAdapter.new.update_section_seats
  end
end

Crono.perform(UpdateSeats).every 5.minutes