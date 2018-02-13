require 'waterdrop'
require 'active_support'
require 'oj'

class EventTransport
  class << self
    %i(create update delete).each do |method|
       define_method "send_#{method}" do |record, type|
         type = ActiveSupport::Inflector.singularize type
         WaterDrop::SyncProducer.call(Oj.dump({ 'type' => type, type => record, 'method' => method.to_s }), topic: 'full_transport') 
      end
    end
  end
end
