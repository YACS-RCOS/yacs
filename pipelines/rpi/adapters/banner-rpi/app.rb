require 'sinatra'
require 'sinatra/json'
require 'oj'
require_relative 'banner_client'
require 'pry'

set :bind, '0.0.0.0'
set :port, 4600

get "/:term_shortname" do
  json subjects: BannerClient.new(params[:term_shortname]).listings_by_subject
end

get "/seats/:term_shortname" do
  json sections: BannerClient.new(params[:term_shortname]).sections
end
