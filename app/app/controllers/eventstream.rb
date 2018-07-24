require 'plezi'
require 'json'

class EventStream

  def on_open
    puts 'Opened the YACS-EventStream Websocket!'
  end

  ## When receiving a single message from Consumer pusblish to socket
  def on_message(data)
    event = {:notifications => :data }
    write event.to_json
  end 

  def on_close
  end
end
Plezi.route '/notifications', EventStream