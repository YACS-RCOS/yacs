require 'waterdrop'
require 'active_support'
require 'oj'

class EventTransport
  def initialize uni_shortname, term_shortname
    @topic = "#{uni_shortname}.raw_records.#{term_shortname}"
  end

  def dispatch method, record, type
    type = ActiveSupport::Inflector.singularize type
    begin
      WaterDrop::SyncProducer.call(Oj.dump({ 'type' => type, type => record, 'method' => method }), topic: @topic)
    rescue Exception => e
      STDERR.puts "ERROR: Failed to deliver message. Will wait and try again.\nERROR: #{e}"
      sleep 5
      retry
    end
  end
end
