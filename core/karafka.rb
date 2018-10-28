# frozen_string_literal: true

# Non Ruby on Rails setup
# ENV['RACK_ENV'] ||= 'development'
# ENV['KARAFKA_ENV'] ||= ENV['RACK_ENV']
# Bundler.require(:default, ENV['KARAFKA_ENV'])
# Karafka::Loader.load(Karafka::App.root)

# Ruby on Rails setup
# Remove whole non-Rails setup that is above and uncomment the 4 lines below

require 'forwardable'
require 'karafka'
ENV['RAILS_ENV'] ||= 'development'
ENV['KARAFKA_ENV'] = ENV['RAILS_ENV']
require ::File.expand_path('../config/environment', __FILE__)
Rails.application.eager_load!
# Karafka::Loader.load(Karafka::App.root)

class App < Karafka::App
  setup do |config|
    config.client_id = 'core'
    config.backend = :inline
    config.batch_fetching = true
    config.batch_consuming = false
    config.kafka.seed_brokers = %w(kafka://kafka:9094)
  end
end

uni_shortname = ENV['UNI_SHORTNAME']

App.consumer_groups.draw do
  Term.find_each do |term|
    consumer_group term.shortname do
      topic "#{uni_shortname}.raw_records.#{term.shortname}" do
        consumer ApplicationConsumer
      end
    end
  end
end

App.boot!
