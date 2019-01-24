require 'pry'

module ExtractListingData

  # List of courses for a subject
  def self.extract_listings html
    elements = html.css('div.primary-head ~ *')
    current = nil
    elements.map do |item|
      if item.name == 'div'
        current = []
        self.parse_course_header item,current
      else
        current << (self.parse_section item)
      end
    end.select { |item| item.is_a? Hash }
  end

  def self.parse_course_header div_tag, sections
    shortname_raw, longname = div_tag.text.split ' - '
    shortname = shortname_raw.split(' ')[1]
    { # Yacs format
      "shortname" => shortname,
      "longname" => longname,
      "sections" => sections
    }
  end

  def self.parse_section a_tag
    course_url = a_tag.attributes['href'].value
    crn = course_url.chomp('/').split('/').last

    data_div = a_tag.css('div.section-content')
    enroll_status = data_div.attributes['data-enrl_stat'].value

    content = data_div.css('div.section-body').map { |element| element.text.strip }
    header, times_string, instructors_string = content.values_at(0,2,4)

    shortname, section_type = self.parse_course_header header
    periods = self.parse_section_times times_string, section_type
    instructors = self.parse_section_instructors instructors_string

    {
      "shortname" => shortname, # required, must be unique-per-listing
      "instructors" => instructors, # optional
      "crn" => crn, # required, registration number/id, unique-per-term
      # "status" => enroll_status,
      "periods" => periods
    }
  end

  def self.parse_course_header course_header # Section: 001-LEC (7869)
    course_header.split(' ')[1].split('-')
  end

  # Days/Times: MoWe 9:30am - 10:45am Fr 2:00pm - 4:00pm Fr 2:00pm - 4:00pm
  DAYS_OF_WEEK = {"Su"=>0, "Mo"=>1, "Tu"=>2, "We"=>3, "Th"=>4, "Fr"=>5, "Sa"=>6}
  def self.parse_section_times section_times_string, type
    times_strings = section_times_string.split(/(?<!-) (?![- ])/)[1..]
    time_strings.each_slice(2).map do |days, time|

      start_time, end_time = time.split(/ - /).map do |time_string|
        Time.parse(time_string).strftime("%H%M")
      end

      days.scan(/../).map do |day|
        {
          "day" => self::DAYS_OF_WEEK[day], # required, day of week (Sunday = 0, Saturday = 6)
          "start" => start_time, # required, start time (24hr)
          "end" => end_time, # required, end time (24hr)
          "type" => type, # optional, but please be consistent in naming if used
        }
      end
    end.flatten
  end

  # Instructor: Esteban O Mazzoni, Gloria Coruzzi, Katie Schneider, Patrick Eichenberger
  def parse_section_instructors section_instructor_string
    section_instructor_string.partition("Instructor: ").last.split(/, /)
  end

end

module ExtractSectionData

  def extract_section html
    fields = html.css('.section-content.clearfix')
    units, description, meets, room = fields.values_at(3,5,9,11).map { |element| parse_field element }
    credits = units[0].to_i

    # Bldg:GCASL Room:275 Loc: Washington Square
    location = room.split(/ /).first(2).map { |item| item.split(/:/).last }.join(' ')
    
    # MoWe 2:00PM - 3:15PM
    periods_count = meets.split(/(?<!-) (?![-])/).each_slice(2).map do |days,time|
      days.size
    end.sum / 2

    {
      "min_credits" => credits,
      "max_credits" => credits,
      "description" => description,
      "periods"     => Array.new(periods_count, Hash["location",location])
    }
  end

  def parse_field element
    element.css('div.pull-right > div').text.strip
  end

end

