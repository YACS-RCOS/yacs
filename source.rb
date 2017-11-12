require 'observer'
require 'faraday'

class Source
  include Observable
  attr_reader :name, :location, :polling_frequency, :data, :thread, :connection, :has_data

  def initialize name, location, polling_frequency
    @name = name
    @location = location
    @polling_frequency = polling_frequency
    @has_data = false
    @data = nil
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
    begin
      response = @connection.get
      data = JSON.parse response.body
      if data != @data
        @data = data
        notify_observers self
        @has_data = true
      end
    rescue
      puts "Error: Unable to get data from source #{@name}"
    end
  end

  def handle_data new_data
    @data = data
  end
end
