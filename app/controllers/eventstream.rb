require 'plezi'
require 'iodine'

class EventStream
  @auto_dispatch = true
  def index
    render 'client'
  end 

  #def on_open
  #  puts "WS connection open"
  #  ::Iodine::subscribe channel: "notifications"
  #end

  def notify(data)
    @notification = data.to_s
    ::Iodine::publish channel: "notifications", message: "#{@notification}"
  end
  
  #def on_message
  #  ::Iodine::subscribe :notifications
  #  ::Iodine::publish :notifications , "#{@data}"
  #end 

  #def on_close 
  #  publish "notifications"
  #end 
end
#test location: ws://localhost:3000/notifications/

