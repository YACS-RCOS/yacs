require 'karafka'
require 'plezi'
require_relative 'application_consumer'

class SectionConsumer < ApplicationConsumer
  def consume
	  EventStream.new.notify(params)
	  puts "SectionsConsumer sent message to websocket"	
  end
end
