require 'sinatra'
require 'sinatra/json'
require 'oj'
require 'yaml'

set :bind, '0.0.0.0'
set :port, 4201

ENV['YAML_SOURCE'] ||= 'schools-and-departments.yml'

get "/" do 
  json YAML.load(open(ENV['YAML_SOURCE']))
end
