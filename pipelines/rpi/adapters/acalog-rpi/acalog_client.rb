require 'active_support'
require 'active_support/core_ext'
require 'nokogiri'
require 'open-uri'
require 'pry'

class AcalogClient
  ACALOG_FIELD_TYPES = {
    description: 'p',
    subject_shortname: 'prefix',
    shortname: 'code',
    longname: 'name'
  }.freeze

  def initialize api_url, api_key, term_shortname
    @api_url = api_url
    @api_key = api_key
    catalog_id = catalog_id_for term_shortname
    load_catalog catalog_id
  end

  def load_catalog catalog_id
    @courses = courses_from catalog_id
    @subjects = @courses.map { |k, v| { shortname: k, listings: v.values }}
    @graph = { subjects: @subjects }
  end

  def find subject_shortname, shortname
    @courses.dig(subject_shortname.to_s, shortname.to_s)
  end

  def listings_by_subject
    @graph
  end

  def course_ids catalog_id
    params = {
      method: :listing,
      catalog: catalog_id,
      'options[limit]': 0
    }
    request('search/courses', params).xpath('//result//id/text()').map(&:text)
  end

  def courses_from catalog_id
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
          [k, course_xml.css(v).text]
        end.to_h
        course[:tags] = ['catalog']
        mapped_courses[course[:subject_shortname]] ||= {}
        mapped_courses[course[:subject_shortname]][course[:shortname]] = course
      end
    end
    mapped_courses
  end

  def current_catalog_id
    node = request('content', method: :getCatalogs).
      xpath('//catalog[state/published = "Yes" and state/archived = "No"]/@id')
    @catalog_id = /acalog-catalog-(?<id>\d+)/.match(node.text)[:id].to_i
  end

  def catalog_id_for term_shortname
    year, month = /(\d{4})(\d{2})/.match(term_shortname).captures.map &:to_i
    catalogs_xml = request('content', method: :getCatalogs)
    year -= 1 if month < 9
    node = catalogs_xml.xpath("//catalog[title[contains(text(),\"#{title_for(year)}\")]]/@id")
    node = catalogs_xml.xpath("//catalog[title[contains(text(),\"#{title_for(year - 1)}\")]]/@id") if node.empty?
    @catalog_id = /acalog-catalog-(?<id>\d+)/.match(node.text)[:id].to_i
  end

  def title_for year
    "Rensselaer Catalog #{year}-#{year + 1}"
  end

  def request path, params
    params = params.merge({ key: @api_key, format: :xml })
    uri = "#{@api_url}/v1/#{path}?#{params.to_query}"
    Nokogiri::HTML(open(uri), nil, 'utf-8')
  end
end
