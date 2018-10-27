require 'sinatra'
require 'sinatra/json'
require 'oj'
require './topics_csv_client'

set :bind, '0.0.0.0'
set :port, 4600

get "/:term_shortname" do
  json subjects: TopicsCsvClient.new(params[:term_shortname]).listings_by_subject
end
