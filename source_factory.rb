require 'yaml'
require './source'

class SourceFactory
  class << self
    def load_sources filename
      yaml = YAML.load_file filename
      puts yaml

      sources = []
      yaml['sources'].each do |name, attrs|
        sources << Source.new(name, attrs['location'], attrs['poll'])
      end

      sources
    end
  end
end
