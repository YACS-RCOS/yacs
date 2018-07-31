require 'plezi'
require 'iodine'
require  'json'
# Replace this sample with real code.
class EventStream
  
   def index
    # any String returned will be appended to the response. We return a String.CLIENT_AS_STRING
    "CLIENT_AS_STRING"
  end
  
  def on_open 
    subscribe "notifications"
    publish "notifications", "OPEN"
  end
  
  def on_message(data) #If no incoming information, send @event
  publish "notifications",data
  puts data
  end

  def on_close 
    publish "notifications", "CLOSE"
  end 
  
end

 

#test location: ws://localhost:3000/notifications/

