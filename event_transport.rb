require 'waterdrop'
require 'active_support'
require 'oj'

class EventTransport
  class << self
    %i(create update delete).each do |method|
      define_method "send_#{method}" do |record, type|
        type = ActiveSupport::Inflector.singularize type
        begin
          WaterDrop::SyncProducer.call(Oj.dump({ 'type' => type, type => record, 'method' => method.to_s }), topic: 'full_transport')
        rescue Exception => e
          STDERR.puts "ERROR: Failed to deliver message. Will wait and try again.\nERROR: #{e}"
          sleep 5
          retry
        end
      end
    end
  end
end
