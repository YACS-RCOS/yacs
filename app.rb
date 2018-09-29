require_relative 'source_manager'
require_relative 'graph'
require_relative 'schema'
require_relative 'priorities'
require_relative 'instance'
require 'sinatra'
require 'sinatra/contrib'
require 'oj'
require 'waterdrop'
require 'redis'
require 'pry'

Redis.current = Redis.new(host: 'redis', port: 6379, db: 11)
WaterDrop.setup do |config|
  config.deliver = true
  config.kafka.seed_brokers = %w(kafka://kafka:9094)
end

config_file = ENV['CONFIG_FILE'] || 'config.yml'
uni_shortname = ENV['UNI_SHORTNAME']
term_shortnames = ENV['TERM_SHORTNAME'].split ','
STDERR.puts "SHORTNAMES: #{term_shortnames}"
config = YAML.load_file config_file
schema_config = config['schema']
priorities_config = config['priorities']
sources_config = config['sources']

instances = term_shortnames.map do |term_shortname|
  [term_shortname, Instance.new(schema_config, priorities_config, sources_config, uni_shortname, term_shortname)]
end.to_h
instances.values.each &:start

set :bind, '0.0.0.0'
set :port, 4500

get '/:term_shortname' do
  json instances[params[:term_shortname]].graph.graph
end
