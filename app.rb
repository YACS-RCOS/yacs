require 'plezi'
require 'iodine'
require_relative 'app/controllers/eventstream'

## Set environment, working directory, load gems and create logs
#ENV['ENV'] ||= ENV['RACK_ENV'] ||= ENV['RAILS_ENV'] # production ENV will render SASS as compressed.
## Using pathname extentions for setting public folder
require 'pathname'
## Set up root object, it might be used by the environment and\or the plezi extension gems.
Root ||= Pathname.new(File.dirname(__FILE__)).expand_path
## If this app is independant, use bundler to load gems (including the plezi gem).
## otherwise, use the original app's Gemfile and Plezi will automatically switch to Rack mode.
require 'bundler'
Bundler.require(:default, ENV['ENV'].to_s.to_sym)
# Load all the code from a subfolder called 'app'
Dir[File.join '{controllers}', '**', '*.rb'].each { |file| load File.expand_path(file) }
# Load all the code from a subfolder called 'lib'
Dir[File.join '{lib}', '**', '*.rb'].each { |file| load File.expand_path(file) }


#Setting the port
#Iodine::DEFAULT_HTTP_ARGS[:port] = 4860

## Logging
#::Iodine::DEFAULT_HTTP_ARGS[:log] = 1 if ::Iodine::DEFAULT_HTTP_ARGS[:log].nil?
#Iodine::DEFAULT_HTTP_ARGS[:public] ||= './public'


# # Optional Scaling (across processes or machines):
ENV['PL_REDIS_URL'] ||= ENV['REDIS_URL'] ||
                        ENV['REDISCLOUD_URL'] ||
                        ENV['REDISTOGO_URL'] ||
                        nil # "redis://:password@my.host:6389/0"
# # redis channel name should be changed IF using the same Plezi code within
# # more then one application (i.e., using both Rails and Plezi together).
# Plezi.app_name = 'yacs_websocket_a027e2d668a7dc21c59fe56f018432ea'

# Map the views folder to the template root (for the {#render} function).
#Plezi.templates = Root.join('views').to_s

# load routes.
load Root.join('routes.rb').to_s

App = Proc.new do |env|
       if(env['rack.upgrade?'.freeze] == :websocket)
           env['rack.upgrade'.freeze] = EventStream.new
           [0, {}, []]
       else
          [200, {"Content-Length" => "12", "Content-Type" => "text/plain"}, ["Hello World!"]]
      end
  
end
