require 'plezi'
require 'iodine'

class EventStream
  #@auto_dispatch = true
  def index
    render 'client'
  end 

  def on_open
    puts "WS connection open"
    ::Iodine::subscribe channel:"notifications" do
      puts "I'm in!"
    end
  end
  
  #TODO
  def on_message data
    #::Iodine::write "#{@data}"
    #puts data
  end 

  def on_close
    ::Iodine::unsubscribe("notifications")
  end 
end
#test location: ws://localhost:3000/notifications/

