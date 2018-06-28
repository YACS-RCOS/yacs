require 'karafka'
require_relative 'application_consumer'

class SectionConsumer < ApplicationConsumer
	def consume
	  puts params #print out the single message received
	end
end
