# Default Rack interface

# load the application
load ::File.expand_path(File.join('..', 'notifications.rb'), __FILE__)

Iodine::DEFAULT_HTTP_ARGS[:public] ||= './public'

run App
#run Plezi.app
