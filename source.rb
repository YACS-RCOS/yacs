require 'observer'
require 'faraday'
require 'oj'
require 'active_support'
require 'active_support/core_ext'

class Source
  include Observable
  attr_reader :name, :location, :polling_frequency, :data, :thread, :connection, :has_data

  def initialize name, location, polling_frequency
    @name = name
    @location = location
    @polling_frequency = polling_frequency
    @data = read_state
    @has_data = @data.present?
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
      data = Oj.load response.body
      STDERR.puts "DEBUG: Got #{data.first[1].size} records from source #{@name}"
      if data != @data
        changed
        @data = data
        write_state
        @has_data = true
        notify_observers self
      end
    rescue Exception => msg
      STDERR.puts msg
      STDERR.puts "Error: Unable to get data from source #{@name}"
      sleep 5
      update
    end
  end

  def handle_data new_data
    @data = data
  end

  def read_state
    begin
      Oj.load Redis.current.get("malg_state/source/#{@name}")
    rescue
      nil
    end
  end

  def write_state
    Redis.current.set "malg_state/source/#{@name}", @data.to_json
  end
end
