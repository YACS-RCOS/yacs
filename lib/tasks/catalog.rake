namespace :catalog do
  task load: :environment do
    Catalog::RpiAdapter.new.load_catalog
  end

  task update_seats: :environment do
    Catalog::RpiAdapter.new.update_section_seats
  end
end