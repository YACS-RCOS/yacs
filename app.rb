require 'sinatra'
require 'sinatra/json'
require 'oj'
require './banner_client'

set :bind, '0.0.0.0'
set :port, 4600

ENV['SEMESTER'] ||= '201801'

BANNER_SECTIONS_URI = "https://sis.rpi.edu/reg/rocs/YACS_#{ENV['SEMESTER']}.xml"
BANNER_COURSES_URI = "https://sis.rpi.edu/reg/rocs/#{ENV['SEMESTER']}.xml"
banner_client = BannerClient.new BANNER_COURSES_URI, BANNER_SECTIONS_URI

get "/" do 
  json departments: banner_client.courses_by_department
end

get "/seats" do
  json sections: banner_client.sections
end
