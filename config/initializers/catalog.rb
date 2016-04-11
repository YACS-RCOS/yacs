Rails.application.config.catalog_adapter = Catalog::RpiAdapter.new

# This is used to diff models when updating from the catalog
require 'active_record/diff'
require 'awesome_print'
AwesomePrint.irb!
