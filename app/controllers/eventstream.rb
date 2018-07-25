require 'plezi'

class EventStream

  def on_open
    puts 'Opened the YACS-EventStream Websocket!'
  end

  ## When receiving a single message from Consumer pusblish to socket
  def on_message data
    unless write { notifications: :data }.to_json
      write "no message sent"
    end
  end 

  def on_close
  end
end
