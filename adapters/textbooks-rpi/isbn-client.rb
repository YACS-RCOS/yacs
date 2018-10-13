require 'nokogiri'
require 'httpclient'
require 'active_support'
require 'active_support/core_ext'

class IsbnClient

	def initialize term_shortname
		@http_client = HTTPClient.new
	end

	private
	
	def banner_courses term_shortname
		
	end

end