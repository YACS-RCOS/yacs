# frozen_string_literal: true
#require 'karafka'
# Non Ruby on Rails setup
ENV['RACK_ENV'] ||= 'development'
ENV['KARAFKA_ENV'] ||= ENV['RACK_ENV']
require 'bundler/setup'
Bundler.require(:default, ENV['KARAFKA_ENV'])
Karafka::Loader.load(Karafka::App.root)
require_relative 'app/consumers/userconsumer.rb'

# Ruby on Rails setup
# Remove whole non-Rails setup that is above and uncomment the 4 lines below
# ENV['RAILS_ENV'] ||= 'development'
# ENV['KARAFKA_ENV'] = ENV['RAILS_ENV']
# require ::File.expand_path('../config/environment', __FILE__)
# Rails.application.eager_load!
require 'karafka'

class KarafkaApp < Karafka::App
  setup do |config|
    config.kafka.seed_brokers = %w(kafka://kafka:9094)
    config.client_id = 'notifications'
    config.backend = :inline
    config.batch_fetching = false
    config.batch_consuming = false
    # Uncomment this for Rails app integration
    # config.logger = Rails.logger
  end
 

  after_init do |config|
    # Put here all the things you want to do after the Karafka framework
    # initialization
    #puts "Initialized"
  end

  Karafka.monitor.subscribe(Karafka::Instrumentation::Listener)
  
  KarafkaApp.consumer_groups.draw do
	consumer_group :notifications do
		topic :section_change do
			consumer UserConsumer
			#batch_consuming true
		end
		
		#topic_group:course_changes do
			#consumer UserConsmer
    end
  end
end
KarafkaApp.boot!

