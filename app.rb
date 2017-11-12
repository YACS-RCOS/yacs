require 'sinatra'
require 'sinatra/json'
require 'oj'
require './acalog_client'

set :bind, '0.0.0.0'
set :port, 4201

ENV['ACALOG_API_URI'] ||= "http://rpi.apis.acalog.com"
ENV['ACALOG_API_KEY'] ||= "3eef8a28f26fb2bcc514e6f1938929a1f9317628"

acalog_client = AcalogClient.new ENV['ACALOG_API_URI'], ENV['ACALOG_API_KEY']
acalog_client.load_current_catalog

get "/" do 
  json acalog_client.courses_by_department
end
