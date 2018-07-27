require 'plezi'
require 'iodine'
require  'json'
# Replace this sample with real code.
class EventStream


  # Websockets
  
   def index
    # any String returned will be appended to the response. We return a String.CLIENT_AS_STRING
    "CLIENT_AS_STRING"
  end

  def on_open 
    subscribe "notifications"
    publish "notifications", "OPEN"
  end
  
  def on_message(data = @event) #If no incoming information, send @event
  publish "notifications",data
  end

  def on_close 
    publish "notifications", "CLOSE"
  end 
  
  def notify(data) 
      @event = data
      puts @event
      self.on_message(@event)
  end

  Plezi.route "/notifications",EventStream
  exit
  
end

 

#ttest location: ws://localhost:3000/notifications/
