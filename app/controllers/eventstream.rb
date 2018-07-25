require 'plezi'
require 'iodine'
require 'json'

class EventStream
  @auto_dispatch = true
  
  def on_open
    puts 'Opened the YACS-EventStream Websocket!'
  end

  #read in data from Kafka Consumers
  def notify(data)
    @event = data
    puts data
  end 
  
  #send data to websocket
  def send_data
    write @event
  end 

  def on_close
  end
end
