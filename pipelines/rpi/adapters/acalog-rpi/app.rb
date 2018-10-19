require 'sinatra'
require 'sinatra/json'
require 'oj'
require './acalog_client'

set :bind, '0.0.0.0'
set :port, 4600

ENV['ACALOG_API_URI'] ||= "http://rpi.apis.acalog.com"
ENV['ACALOG_API_KEY'] ||= "3eef8a28f26fb2bcc514e6f1938929a1f9317628"
$acalog_clients = {}

def client_for term_shortname
  $acalog_clients[term_shortname] ||= AcalogClient.new ENV['ACALOG_API_URI'], ENV['ACALOG_API_KEY'], term_shortname
end

get "/:term_shortname" do 
  json client_for(params[:term_shortname]).listings_by_subject
end
