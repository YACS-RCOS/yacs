require 'active_support'
require 'active_support/core_ext'
require_relative 'process_data'

class AlbertClient

	ALBERT_ROOT = 'https://m.albert.nyu.edu/app/catalog/classSearch/'
	ALBERT_DATA = 'https://m.albert.nyu.edu/app/catalog/getClassSearch'

	def initialize schools_filename='/usr/src/app/schools.yml'
		@http_client = HTTPClient.new
		@csrf_token = get_csrf_token
		@schools_filename = schools_filename
	end

	def schools term_shortname
		schools.each do |school|
			schools[:subjects].each do |subject|
				subject[:listings] = listings term[:shortname], school[:shortname], subject[:shortname]
			end
		end
	end

	# def schools
	# 	get_drop_down_values 'search-acad-group'
	# end

	def terms
		get_drop_down_values 'term'
	end

	private

	def listings term_shortname, school_shortname, subject_shortname
		response = post_request_xml term_shortname, school_shortname, subject_shortname
		extract_listings response
	end

	# def schools
	# 	YAML.load schools_filename
	# end

	def extract_listings html
		elements = html.children
		elements[0] = Hash.new { |h,k| h[k] = [] }
		elements.inject do |first, second|
			nil
		end
		html
	end

	def parse_header div_tag

	end

	def parse_section a_tag

	end

	def post_request_xml term, school, subject
		url = URI::join ALBERT_ROOT, term.to_s
		form_body = {
			CSRFToken: @csrf_token,
			term: term,
			acad_group: school,
			subject: subject
		}
		request_html :post, ALBERT_DATA, nil, form_body, { Referer: url }
	end

	def get_drop_down_values id
		xml = request_html :get, ALBERT_ROOT
		nodes = xml.css("##{id}").css('option')
		nodes[1..].map do |node|=
			{
				shortname: node.attributes['value'].value,
				longname: node.text
			}
		end
	end

	def get_csrf_token
		response = @http_client.get ALBERT_ROOT
		cookies = @http_client.cookie_manager.cookies
		cookies.select { |c| c.name == 'CSRFCookie'}
	end

	def request_html method, url, query=nil, body=nil, headers={}
		response = @http_client.request method, url, query, body
		Nokogiri::HTML.parse response.body
	end
end
