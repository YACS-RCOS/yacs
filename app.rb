require 'pry'
require './source_manager'
require './graph'
require './schema'
require './priorities'
require 'sinatra'
require 'sinatra/contrib'
require 'oj'

config_file = ENV['CONFIG_FILE'] || 'config.yml'

schema = Schema.new config_file
priorities = Priorities.new config_file

graph = Graph.new priorities, schema

source_manager = SourceManager.new config_file
source_manager.register_all graph
source_manager.start_all
source_manager.start_watcher

graph.build source_manager.sources

set :bind, '0.0.0.0'
set :port, 4301

get '/' do
  json graph.graph
end