require 'karafka'
require_relative 'application_consumer'
require 'plezi'

class CourseConsumer < ApplicationConsumer
  def consume
	  if ( Object.const_defined?('EventStream') == false )
	    puts "EventStream class not initialized" 
	  else 
	    EventStream.on_message(params)
	    puts "Consumer message sent to websocket"
	  end	
  end
end
