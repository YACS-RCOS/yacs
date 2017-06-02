class Api::V5::MessagingController < ApplicationController
	include ActionController::Live

	def send_message
    response.headers['Content-Type'] = 'text/event-stream'
    10.times {
      response.stream.write "This is a test message"
      sleep 1
    }
    response.stream.close
  	end
  	
end
 #doesn't really work yet