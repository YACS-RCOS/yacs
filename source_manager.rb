require './source_factory'

class SourceManager
  WATCH_FREQUENCY = 60

  attr_reader :sources

  def initialize filename
    @sources = SourceFactory.load_sources filename
  end

  def register_all graph
    @sources.each { |source| source.add_observer graph }
  end

  def start_all
    @sources.each do |source|
      source.start
    end
  end

  def start_watcher
    Thread.new { watch }
  end

  private

  def watch
    loop do
      @sources.each do |source|
        unless source.healthy?
          STDERR.puts "Error: #{source.name} failed healthcheck. Restarting..."
          source.start
        end
      end
      sleep WATCH_FREQUENCY
    end
  end
end
