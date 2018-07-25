require 'plezi'
require 'iodine'

class EventStream
  #@auto_dispatch = true
  
  def on_open
  end

  def notify(data)
    @event = data
    puts data
  end
  
  ##Update: Check changelog & documentation
  #send data to websocket //  trying to use iodine
  def on_message(client, data = @event) 
    @notifications = data.to_sym
    #transmit data to all websocket connections
    client.publish @notifications
    #client.publish @notifications
  end 

  def on_close
  end
end
