require 'karafka'
require 'plezi'
require 'iodine'
require_relative 'application_consumer'

class SectionConsumer < ApplicationConsumer
  def consume
    #EventStream.notify(params) 
    #puts "Consumer message sent to websocket"	
    puts params
    #EventStream.run
  end
end
