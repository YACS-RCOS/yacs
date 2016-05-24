namespace :catalog do
  task load: :environment do
    Rails.application.config.catalog_adapter.load_catalog
    ap 'Successfully loaded!'
  end

  task destroy: :environment do
    Rails.application.config.catalog_adapter.destroy_catalog
    ap 'Successfully destroyed!'
  end
end
