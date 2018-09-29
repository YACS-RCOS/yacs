module Requests
  module ParseHelpers
    def json
      JSON.parse(response.body)
    end
    def xml
      @xml = Nokogiri::Slop(response.body) if response.body != @body
      @body = response.body
      @xml
    end
  end
end