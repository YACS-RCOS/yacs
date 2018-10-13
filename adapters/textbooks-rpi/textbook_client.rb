require 'nokogiri'
require 'httpclient'
require 'active_support'
require 'active_support/core_ext'
require_relative 'efollet_client'

class TextbookClient < Struct.new :term_shortname, :bookstore_id

  def initialize
    @http_client = HTTPClient.new
    @efollet_client = EfolletClient.new @bookstore_id
  end

  def listings_by_subject_with_textbooks term_shortname
    banner_listings_by_subject(term_shortname).map do |subject|
      listings = []
      subject['listings'].each do |listing|
        if listing['sections'].present?
          crn = listing['sections'].first['crn']
          listings << {
            shortnane: listing['shortname'],
            textbooks: get_textbooks_for_crn(crn)
          }
        end
      end
      { shortname: subject['shortname'], listings: listings }
    end
  end

  private
  
  def banner_listings_by_subject term_shortname
    subjects = get_json("adapter-banner/#{term_shortname}")['subjects'] || []
  end

  def get_textbooks_for_crn crn
    @efollet_client.get_required_textbook_isbns crn
  end

  def get_json uri
    JSON.parse(@http_client.get(uri).body)
  end

  def get_xml uri
    Nokogiri::XML(@http_client.get(uri).body)
  end

end