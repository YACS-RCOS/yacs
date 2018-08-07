require 'plezi'
require 'iodine'

class EventStream
  #@auto_dispatch = true

  def on_open client
    puts "WS connection open"
    ::Iodine::subscribe channel: "notifications"
  end

  def notify(data)
    @notification = data.to_s
    ::Iodine::publish channel: "notifications", message: "#{@notification}"
  end
  
  def on_message client, data 
    ::Iodine::subscribe :notifications
    ::Iodine::publish :notifications , "#{@data}"
  end 

  def on_close
  end
end
Plezi.route '/', EventStream
