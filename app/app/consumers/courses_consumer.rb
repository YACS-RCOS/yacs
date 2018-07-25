require 'karafka'
require 'plezi'
require 'iodine'
require_relative 'application_consumer'

class CourseConsumer < ApplicationConsumer
  def consume
	  if ( Object.const_defined?('EventStream') == false )
	    puts "EventStream class not initialized" 
	  else 
	    EventStream.new.notify(params)
	    puts "Consumer message sent to websocket"
	  end	
  end
end
