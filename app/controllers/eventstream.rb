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

## TODO:
## 1.AutoDispatch endpoint for JSON message sending 
## 2.find the Karafka host
##   --> kafka://kafka:9094

class EventStream
  TOPICS_CHANNEL = #
  ## considering the JSON communication channel
  @auto_dispatch = true
  protected

  ###
  # WebSockets
  ###
  #def re_connect 
  #end 
  
  ## on initiializaion speak to the kafka server 
  def on_open
    # 'kafka://kafka:9094'
    TOPIC_CHANNEL_SECTIONS
    subscribe #
    write 'Opened the YACS-EventStream Websocket!'
    # on open, the server needs to be communicating with the Kafka responders 
     #subscribe to the kafka server, take in messages from the kafka consumers 

    # Subscribe to messages from the consumer  
    #subscribe KAFKA_CONSUMER
  end


  ## When receiving a single message from 
  def on_message(data)
    ## Take in Kafka consumer data and parse it for the front it 
    new_data = ERB::Util.html_escape data # parse_json(data)
    publish new_data
  end 

  ##What does this do?
  def on_close
  end

end 

Plezi.route '*' , EventStream #to all route addreses 

