require 'karafka'
require 'plezi'
require_relative 'application_consumer'

class SectionConsumer < ApplicationConsumer
  def consume
    EventStream.new.notify(params)
    puts "Consumer message sent to websocket"	
  end
end
