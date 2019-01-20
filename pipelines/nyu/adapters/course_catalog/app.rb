require 'sinatra'
require 'sinatra/json'
require 'oj'
require_relative 'albert_client'
require 'pry'


set :bind, '0.0.0.0'
set :port, 4600

$albert_client = AlbertClient.new

get "/:term_shortname" do
	json $albert_client.subjects
end
