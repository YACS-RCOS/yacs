require 'karafka'
require 'plezi'
require_relative 'application_consumer'

class CourseConsumer < ApplicationConsumer
  def consume
	  EventStream.new.notify(params)
	  puts "CoursesConsumer sent message to websocket"	
  end
end
