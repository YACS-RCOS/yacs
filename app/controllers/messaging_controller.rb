class MessagingController < ActionController::Base
	include ActionController::Live
	
	def index
  	end

	def send_message
    response.headers['Content-Type'] = 'text/event-stream'
    10.times {
      response.stream.write "controller works"
      sleep 1
    }
    response.stream.close
  	end
  	
end