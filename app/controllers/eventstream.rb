##   Client side
##  Javascript file to emit an event in JSON format 

#   client.emit(
#      {
#          event: "notification" , 
#          data: "the consumer response" 
#      }
#   )

require 'plezi'
## TODO:
#continue here http://www.plezi.io/docs/json-autodispatch
# Echo Raw Message from Consumer to Client
class EventStream
  ## considering the JSON communication channel
  #@auto_dispatch = true
  #protected
  
  ## on initiializaion speak to the kafka server 
  def on_open
    #return close unless params['id']
    #@service = params['id']
    #subscribe ''
    #publish message: "Connected to #{@service}"
    puts 'Opened the YACS-EventStream Websocket!'
  end

  ## When receiving a single message from Consumer pusblish to socket
  def on_message(data)
    # write message to the client
    #write "#{@service}: #{data}"
    write { notifications: :data }.to_json
  end 

  ##What does this do?
  def on_close
  end

end 

Plezi.route '/' , EventStream #to all route addreses 
#Plezi.route '/notifications' , EventStream #to all route addreses 

