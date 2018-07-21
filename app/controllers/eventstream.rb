##   Client side
##  Javascript file to emit an event in JSON format 

#   client.emit(
#      {
#          event: "notification" , 
#          data: "the consumer response" 
#      }
#   )

## 
##  The Websocket 
##  JSON Echo Server

require 'plezi'
## TODO:
#continue here http://www.plezi.io/docs/json-autodispatch
class EventStream
  #TOPICS_CHANNEL = #
  ## considering the JSON communication channel
  @auto_dispatch = true
  protected
  
  ## on initiializaion speak to the kafka server 
  def on_open
    return close unless params['id']
    @service = params['id']
    #subscribe ''
    publish message: "Connected to #{@service}"
    puts 'Opened the YACS-EventStream Websocket!'
  end

  ## When receiving a single message from Consumer pusblish to socket
  #def on_message(data)
   # publish new_data message: "#{@name}: #{data}"
  #end 

  ##What does this do?
  def on_close
  end

end 

Plezi.route '/notifications' , EventStream #to all route addreses 

