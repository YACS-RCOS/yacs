# Default Rack interface
# encoding: UTF-8
# load the application
load ::File.expand_path(File.join('..', 'app.rb'), __FILE__)

run App
run Plezi.app
