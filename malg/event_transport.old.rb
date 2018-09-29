require 'rest-client'

class EventTransport
  API_BASE = 'https://yacs.cs.rpi.edu/api/v5/'

  def send_create record, type
    send_request({
      method: :post,
      url: "#{API_BASE}/#{type}",
      payload: { type => record }
    }, record, type)
  end


  def send_update record, type
    send_request({
      method: :put,
      url: "#{API_BASE}/#{type}/#{record['uuid']}",
      payload: { type => record }
    }, record, type)
  end

  def send_delete record, type
    send_request({
      method: :delete,
      url: "#{API_BASE}/#{type}/#{record['uuid']}"
    }, record, type)
  end

  private

  def send_request request, record, type
    begin
      RestClient::Request.execute request
    rescue RestClient::ExceptionWithResponse => e
      STDERR.puts "ERROR: Failed to send #{request[:method]} for #{type} #{record['uuid']}. Response: #{e.response}"
    end
  end
end
