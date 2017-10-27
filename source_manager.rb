require './source_factory'

class SourceManager
  WATCH_FREQUENCY = 60

  attr_reader :sources

  def initialize filename
    @sources = SourceFactory.load_sources filename
  end

  def start_all
    @sources.each do |source|
      source.start
    end
  end

  def watch
    loop do
      @sources.each do |source|
        unless source.healthy?
          puts "Error: #{source.name} failed healthcheck. Restarting..."
          source.start
        end
      end
      sleep WATCH_FREQUENCY
    end
  end
end
