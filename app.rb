require 'pry'
require './source_manager'
require './graph'
require './schema'
require './priorities'

config_file = ENV['CONFIG_FILE'] || 'config.yml'

schema = Schema.new config_file
priorities = Priorities.new config_file

graph = Graph.new priorities, schema

source_manager = SourceManager.new config_file
source_manager.register_all graph
source_manager.start_all
source_manager.start_watcher

# binding.pry

graph.build source_manager.sources