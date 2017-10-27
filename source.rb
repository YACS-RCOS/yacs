require 'faraday'

class Source

  attr_reader :name, :location, :polling_frequency, :data, :thread, :connection

  def initialize name, location, polling_frequency
    @name = name
    @location = location
    @polling_frequency = polling_frequency
  end

  def start
    @thread.exit if @thread
    @thread = Thread.new { run }
  end

  def healthy?
    @thread && @thread.alive?
  end

  private

  def run
    @connection = Faraday.new(url: @location)
    loop do
      update
      sleep @polling_frequency
    end
  end

  def update
    response = @connection.get
    data = JSON.parse response.body
    merge_data data
  end

  def merge_data new_data
    @data = data
  end
end
