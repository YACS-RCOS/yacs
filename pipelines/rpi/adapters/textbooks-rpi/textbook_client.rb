require 'nokogiri'
require 'httpclient'
require 'active_support'
require 'active_support/core_ext'

class TextbookClient

  def initialize efollet_client, term_shortname
    @http_client = HTTPClient.new
    @efollet_client = efollet_client
    @term_shortname = term_shortname
    load_textbooks
  end

  def listings_by_subject_with_textbooks
    @graph
  end

  private

  def load_textbooks
    subjects = banner_listings_by_subject(@term_shortname).map do |subject|
      listings = []
      subject['listings'].each do |listing|
        if listing['sections'].present?
          crn = listing['sections'].first['crn']
          textbooks = get_textbooks_for_crn crn
          listings << {
            shortname: listing['shortname'],
            required_textbooks: textbooks[:required],
            recommended_textbooks: textbooks[:recommended]
          }
        end
      end
      { shortname: subject['shortname'], listings: listings }
    end
    @graph = { subjects: subjects }
  end
  
  def banner_listings_by_subject term_shortname
    subjects = get_json("http://adapter-banner:4600/#{term_shortname}")['subjects'] || []
  end

  def get_textbooks_for_crn crn
    @efollet_client.get_textbook_isbns @term_shortname, crn
  end

  def get_json uri
    JSON.parse(@http_client.get(uri).body)
  end

  def get_xml uri
    Nokogiri::XML(@http_client.get(uri).body)
  end

end
