require 'active_support'
require 'active_support/core_ext'
require 'pry'

class AlbertClient

	ALBERT_ROOT = 'https://m.albert.nyu.edu/app/catalog/classSearch/'
	ALBERT_DATA = 'https://m.albert.nyu.edu/app/catalog/getClassSearch'

	def initialize
		@http_client = HTTPClient.new
		@csrf_token = get_csrf_token
	end

	def schools
		get_drop_down_values 'search-acad-group'
	end

	def terms
		get_drop_down_values 'term'
	end

	def query_albert(term, school, subject)
		response = post_request_xml(term, school, subject)
		output = parse_data_response response
		binding.pry
		output
	end

	def parse_data_response response
		nil
	end

	private

	def post_request_xml(term, school, subject)
		url = URI::join(ALBERT_ROOT,term.to_s)
		form_body = {
			CSRFToken: @csrf_token,
			term: term,
			acad_group: school,
			subject: subject }
		post_html(ALBERT_DATA, form_body, extheader = { Referer: url })
	end

	def post_html(url, body, extheader = {})
		response = @http_client.post(url, body, extheader = extheader)
		Nokogiri::HTML.parse(response.body)
	end

	def get_drop_down_values id
		xml = get_xml ALBERT_ROOT
		nodes = xml.css("##{id}").css('option')
		nodes[1..].map do |node|
			{shortname: node.attributes['value'].value,
				longname: node.text }
		end
	end

	def get_csrf_token
		response = @http_client.get ALBERT_ROOT
		cookies = @http_client.cookie_manager.cookies
		cookies.each do |cookie|
			if cookie.name == 'CSRFCookie'
				return cookie.value
			end
		end
	end

	def get_xml url # TODO take method name as string
		# @http_client.send verb, params
		response = @http_client.get(url)
		Nokogiri::XML.parse(response.body)
	end
end
