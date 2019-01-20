require 'nokogiri'
require 'httpclient'
require 'active_support'
require 'active_support/core_ext'
require 'pry'

class AlbertClient

	ALBERT_ROOT = 'https://m.albert.nyu.edu/app/catalog/classSearch'

	def initialize
		@http_client = HTTPClient.new
	end

	# def listings_by_subject

	# end

	# def listings
	# 	url = "albert.com"
	# 	xml = get_xml url
	# end

	def subjects
		xml = get_xml ALBERT_ROOT
		subject_nodes = xml.css('#search-acad-group').css('option')
		subjects = subject_nodes[1..].map do |subject_node|
			{
				shortname: subject_node.attributes['value'].value,
				longname: subject_node.text
			}
		end
	end

	private

	# def class_search
	# 	body = {

	# 	}
	# end

	def get_csrf_token
		response = @http_client.get ALBERT_ROOT
		response.headers['Set-Cookie'].match(/(?:[A-Za-z]+=)([^;]+)/).second
	end

	def get_xml url
		response = @http_client.get(url)
		Nokogiri::XML.parse(response.body)
	end
end
