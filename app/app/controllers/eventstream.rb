require 'plezi'
require 'iodine'
require 'json'

class EventStream
  #@auto_dispatch = true
  
  def on_open
    puts 'Opened the YACS-EventStream Websocket!'
  end

  #def on_message data
  def notify(data)
    puts data
    #event = {:notifications => data }
    #puts event.to_json  # need to figure out this shit
  end 

  def on_close
  end
end
#Plezi.route '/notifications', EventStream
#ip address 172.19.0.9:9094