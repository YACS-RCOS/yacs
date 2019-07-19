require 'nokogiri'
require 'httpclient'
require 'active_support'
require 'active_support/core_ext'

class BannerClient

  def initialize term_shortname
    @sections_uri = "https://sis.rpi.edu/reg/rocs/YACS_#{term_shortname}.xml"
    @listings_uri = "https://sis.rpi.edu/reg/rocs/#{term_shortname}.xml"
    @http_client = HTTPClient.new
  end

  def sections
    sections = get_xml(@sections_uri).xpath('//CourseDB/SECTION')
    sections.map do |xml|
      xml.to_h.symbolize_keys.map do |k, v|
        case k
        when :crn then [:crn, v]
        when :num then [:shortname, v]
        when :seats then [:seats, v]
        when :students then [:seats_taken, v]
        else [nil, nil]
        end
      end.to_h.compact
    end
  end

  def listings
    listings = get_xml(@listings_uri).xpath('//COURSE')
    listings.map do |xml|
      listing = xml.to_h.symbolize_keys.map do |k, v|
        case k
        when :credmin then [:min_credits, v]
        when :credmax then [:max_credits, v]
        when :num     then [:shortname, v]
        when :name    then [:longname, v.titleize]
        when :dept    then [:subject, { shortname: v }]
        else [nil, nil]
        end
      end.to_h.compact
      listing[:sections] = extract_sections xml
      listing
    end
  end

  def listings_by_subject
    subjects = {}
    listings.each do |listing|
      subjects[listing[:subject][:shortname]] ||= []
      subjects[listing[:subject][:shortname]] << listing
      listing.delete :subject
    end
    subjects.map { |k, v| { shortname: k, listings: v } }
  end

  private

  def get_xml uri
    Nokogiri::XML(@http_client.get(uri).body)
  end

  def extract_sections listing
    listing.xpath('SECTION').map do |xml|
      section = xml.to_h.symbolize_keys.map do |k, v|
        case k
        when :num       then [:shortname, v]
        when :crn       then [:crn, v]
        when :seats     then [:seats, v]
        when :students  then [:seats_taken, v]
        else [nil, nil]
        end
      end.to_h.compact
      #section[:periods] = extract_periods xml

      section[:instructors]   = []
      section[:periods] = []
      xml.xpath('PERIOD').each do |pxml|
        section[:instructors].concat(pxml[:instructor].strip.split(/\//))

        pxml.element_children.each do |day|
          section[:periods] << extract_periods(pxml, day)
        end

      end
      section[:instructors].uniq!
      section[:instructors].delete 'Staff'
      section
    end
  end

  def extract_periods pxml, day
    period = pxml.to_h.symbolize_keys.map do |k,v|
      case k
      when :instructor
        v.strip.split(/\//)
        [:instructor, v.strip.split(/\//)]
      when :type        then [:type, v]
      when :start       then [:start, v]
      when :end         then [:end, v]
      when :location    then [:location, v]
      else [nil, nil]
      end
    end.to_h.compact

    period[:day] = day.text.to_i+1
    period
  end
end
