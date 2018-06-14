# frozen_string_literal: true

# Non Ruby on Rails setup
# ENV['RACK_ENV'] ||= 'development'
# ENV['KARAFKA_ENV'] ||= ENV['RACK_ENV']
# Bundler.require(:default, ENV['KARAFKA_ENV'])
# Karafka::Loader.load(Karafka::App.root)

# Ruby on Rails setup
# Remove whole non-Rails setup that is above and uncomment the 4 lines below
ENV['RAILS_ENV'] ||= 'development'
ENV['KARAFKA_ENV'] = ENV['RAILS_ENV']
require ::File.expand_path('../config/environment', __FILE__)
Rails.application.eager_load!

class ConsumerApp < Karafka::App
  setup do |config|
    config.client_id = 'core'
    config.backend = :inline
    config.batch_fetching = false
    config.batch_consuming = false
    config.kafka.seed_brokers = %w(kafka://kafka:9094)
  end
end  

ConsumerApp.consumer_groups.draw do
  consumer_group :core do
    topic :full_transport do
      controller ApplicationConsumer
    end
  end
end

ConsumerApp.boot!
