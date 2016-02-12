require 'rufus-scheduler'

namespace :catalog do
  task update_seats: :environment do
    rufus = Rufus::Scheduler.singleton
    updater = Catalog::RpiCatalogUpdater.new
    rufus.every '5m' do
      Rails.logger.info "initiating seat data update"
      Rails.logger.flush
      updater.update_section_seats
    end
  end
end