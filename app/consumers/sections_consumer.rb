require 'karafka'
require_relative 'application_consumer'

class SectionConsumer < ApplicationConsumer
  def consume
	if ( Object.const_defined?('EventStream') == false )
	  raise 
	else 
	  EventStream.on_message(params)
	  puts "JSON event emitted to websocket"
	end		
  end
end
