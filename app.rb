require 'sinatra'
require 'sinatra/json'
require 'oj'
require './topics_csv_client'

set :bind, '0.0.0.0'
set :port, 4201

ENV['CSV_SOURCE'] ||= 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQUq7f_TXYzCy4nRh0GnIRgK31jbm_TIfjeaeJ_4-Ek26AUQ0S7Gkrw9DvwJGuu1-nXZDyk1FbZZWD/pub?gid=0&single=true&output=csv'
topics_csv_client = TopicsCsvClient.new ENV['CSV_SOURCE']

get "/" do 
  json departments: topics_csv_client.courses_by_department
end
