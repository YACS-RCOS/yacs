require 'karafka'
require_relative 'application_consumer'
class UserConsumer < ApplicationConsumer
	def consume 
	    puts 'called'
		puts params
	end
	
	
	def checking
	end
end
