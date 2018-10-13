require 'nokogiri'
require 'httpclient'
require 'active_support'
require 'active_support/core_ext'

class TextbookClient < Struct.new :bookstore_id

  BOOKSTORE_URL = "https://www.bkstr.com/webapp/wcs/stores/servlet/booklookServlet"

  def initialize
    @http_client = HTTPClient.new
  end

  def get_required_textbook_isbns term_id, crn
    html = get_listing_page_xml term_id, crn
    textbook_details = html.css('li#material-group_REQUIRED div.material-group-details')
    textbook_details.select do |textbook_detail|
      textbook_detail.css('div.material-group-table tr.print_background td').any? do |text_attribute|
        text_attribute.text[/hardcover|softcover/i]
      end
    end.map do |textbook_detail|
      isbn = textbook_detail.css('span#materialISBN').text[/\d{13}/]
      isbn.to_i if isbn
    end.compact
  end

  def get_listing_page_xml term_id, crn
  	Nokogiri::XML.parse(@http_client.get(BOOKSTORE_URL, { 
  		:"bookstore_id-1" => @bookstore_id
  		:"term_id-1" => term_id,
  		:"crn-1" => crn
  	}).body)
  end
end