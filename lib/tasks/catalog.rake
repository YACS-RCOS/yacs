require 'rufus-scheduler'

namespace :catalog do
  task load: :environment do
    Catalog::RpiCatalogLoader.new.load_catalog
  end

  task update_seats: :environment do
    Catalog::RpiCatalogUpdater.new.update_section_seats
  end
end