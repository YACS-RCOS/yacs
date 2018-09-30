require 'sinatra'
require 'sinatra/json'
require 'oj'
require 'yaml'

set :bind, '0.0.0.0'
set :port, 4600

ENV['YAML_SOURCE'] ||= 'schools-and-subjects.yml'

get "/:term_shortname" do 
  json YAML.load(open(ENV['YAML_SOURCE']))
end
