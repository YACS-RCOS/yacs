require 'nokogiri'
require 'httpclient'

ALBERT_ROOT = 'https://m.albert.nyu.edu/app/catalog/classSearch/'
ALBERT_DATA = 'https://m.albert.nyu.edu/app/catalog/getClassSearch'

class ClientConnection

  attr_reader :http_client

  def initialize
    @http_client = HTTPClient.new
  end

  def cookies
    @http_client.cookie_manager.cookies
  end

  def post_html(url, body, extheader = {})
		response = @http_client.post(url, body, extheader = extheader)
		Nokogiri::HTML.parse(response.body)
	end

  def get_xml url # TODO take method name as string
    # @http_client.send verb, params
    response = @http_client.get(url)
    Nokogiri::XML.parse(response.body)
  end
