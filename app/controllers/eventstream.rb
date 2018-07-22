require 'plezi'

class EventStream

  def on_open
    puts 'Opened the YACS-EventStream Websocket!'
  end

  ## When receiving a single message from Consumer pusblish to socket
  def on_message(data)
    write { notifications: :data }.to_json
  end 

  def on_close
  end
end 

Plezi.route '/' , EventStream
