require_relative 'app/controllers/eventstream.rb'
## 
# ws://0.0.0.0/EventStream
Plezi.route '/notifications', EventStream
