require 'pry'
require './source_manager'
require './graph'
require './schema'
require './priorities'
require 'sinatra'
require 'sinatra/contrib'
require 'oj'
require 'waterdrop'
require 'redis'

WaterDrop.setup do |config|
  config.deliver = true
  config.kafka.seed_brokers = %w(kafka://kafka:9094)
end

Redis.current = Redis.new(host: 'redis', port: 6379, db: 11)

config_file = ENV['CONFIG_FILE'] || 'config.yml'

schema = Schema.new config_file
priorities = Priorities.new config_file

graph = Graph.new priorities, schema

source_manager = SourceManager.new config_file
source_manager.register_all graph
source_manager.start_all
source_manager.start_watcher

graph.build source_manager.sources unless graph.load

set :bind, '0.0.0.0'
set :port, 4500

get '/' do
  json graph.graph
end
