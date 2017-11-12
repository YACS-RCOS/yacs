require 'active_support'
require 'active_support/core_ext'
require 'nokogiri'
require 'open-uri'
require 'pry'

class AcalogClient
  ACALOG_FIELD_TYPES = {
    description: 365,
    department_code: 380,
    number: 382,
    name: 384
  }.freeze

  def initialize api_url, api_key
    @api_url = api_url
    @api_key = api_key
  end

  def load_current_catalog
    @courses = courses(current_catalog_id)
    @departments = @courses.map { |k, v| { code: k, courses: v.values }}
    @graph = { departments: @departments }
  end

  def find department_code, number
    @courses.dig(department_code.to_s, number.to_s)
  end

  def courses_by_department
    @graph
  end

  # private

  def course_ids catalog_id
    params = {
      method: :listing,
      catalog: catalog_id,
      'options[limit]': 0
    }
    request('search/courses', params).xpath('//result//id/text()').map(&:text)
  end

  def courses catalog_id
    params = {
      method: :getItems,
      type: :courses,
      catalog: catalog_id,
      'options[full]': 1
    }
    mapped_courses = {}
    # mapped_courses.default = {}
    all_ids = course_ids catalog_id
    all_ids.each_slice(200) do |ids|
      response = request('content', params.merge(ids: ids))
      response.xpath('//course/content').each do |course_xml|
        course = ACALOG_FIELD_TYPES.map do |k, v|
          [k, course_xml.css("field[type = \"acalog-field-#{v}\"]").text]
        end.to_h
        mapped_courses[course[:department_code]] ||= {}
        mapped_courses[course[:department_code]][course[:number]] = course
      end
    end
    mapped_courses
  end

  def current_catalog_id
    node = request('content', method: :getCatalogs).
      xpath('//catalog[state/published = "Yes" and state/archived = "No"]/@id')
    @catalog_id = /acalog-catalog-(?<id>\d+)/.match(node.text)[:id].to_i
  end

  def request path, params
    params = params.merge({ key: @api_key, format: :xml })
    uri = "#{@api_url}/v1/#{path}?#{params.to_query}"
    Nokogiri::HTML(open(uri), nil, 'utf-8')
  end
end
