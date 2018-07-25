require 'karafka'
require 'plezi'
require 'iodine'
require_relative 'application_consumer'

class CourseConsumer < ApplicationConsumer
  def consume
	  EventStream.new.notify(params)
	  puts "Consumer message sent to websocket"	
  end
end
