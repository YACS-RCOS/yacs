require 'yaml'
require './source'

class SourceFactory
  class << self
    def load_sources config, uni_shortname, term_shortname
      config['sources'].map do |name, attrs|
        Source.new(uni_shortname, term_shortname, name, attrs['location'], attrs['poll'])
      end
    end
  end
end
