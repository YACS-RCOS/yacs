require 'sinatra'
require 'sinatra/json'
require 'oj'

set :bind, '0.0.0.0'
set :port, 4201

get "/" do 
  json courses: []
end
