require 'pry'
require 'uri'

# List of courses for a subject
def extract_listings html
  elements = html.children[1].child.children[1..]
  current = nil
  elements.map do |item|
    if item.name == 'div'
      current = []
      parse_course_header item,current
    else
      if item.name == 'a'
        current << (parse_section item)
      end
      nil
    end
  end.select { |item| item.is_a? Hash }
end

def parse_course_header div_tag,sections
  shortname_raw, longname = div_tag.text.split ' - '
  shortname = shortname_raw.split(' ')[1]
  { # Yacs format
    "shortname" => shortname,
    "longname" => longname,
    "min_credits" => nil,
    "max_credits" => nil,
    "description" => nil,
    "sections" => sections
  }
end

def parse_section a_tag
  course_url = a_tag.attributes['href'].value
  crn = URI(course_url).path.chomp('/').split('/').last

  data_div = a_tag.children.find { |element| element.name == 'div' }
  enroll_status = data_div.attributes['data-enrl_stat'].value

  content_divs = data_div.children.select { |element| element.name == 'div' }

  section_number, section_type = parse_section_header content_divs[0].text.strip
  periods = parse_section_times content_divs[2].text.strip,section_type
  instructors = parse_section_instructors content_divs[4].text.strip

  {
    "shortname" => section_number, # required, must be unique-per-listing
    "instructors" => instructors, # optional
    "crn" => crn, # required, registration number/id, unique-per-term
    "seats" => 1, # optional, total seats in section
    "seats_taken" => enroll_status == 'O' ? 0 : 1, # optional, seats taken in section (available = seats - seats_taken)
    "periods" => periods
  }
end

def parse_section_header sec_header # Section: 001-LEC (7869)
  sec_header.split(' ')[1].split('-')
end

# Days/Times: MoWe 9:30am - 10:45am Fr 2:00pm - 4:00pm Fr 2:00pm - 4:00pm
DaysOfWeek = "SuMoTuWeThFrSa".scan(/../).zip(0..6).to_h
def parse_section_times sec_times_string, type
  times_strings = sec_times_string.split(/(?<!-) (?![- ])/)[1..]
  times = Hash[times_strings.each_slice(2).to_a]
  periods = []
  times.each do |days,time|
    start_time_string, end_time_string = time.split(/ - /)
    days.scan(/../).each do |day|
      periods << {
        "day" => ::DaysOfWeek[day], # required, day of week (Sunday = 0, Saturday = 6)
        "start" => parse_period_time(start_time_string), # required, start time (24hr)
        "end" => parse_period_time(end_time_string), # required, end time (24hr)
        "type" => type, # optional, but please be consistent in naming if used
        "location" => nil # optional, but please abbreviate if used
      }
    end
  end
  periods
end

#2:00pm
def parse_period_time period_time_string
  hour,suffix = period_time_string.split(/:/)
  minutes, am_pm = suffix.scan(/../)
  if hour == '12'
    return "#{am_pm == 'am' ? hour.to_i - 12 : hour}#{minutes}"
  end
  if am_pm == 'am'
    return "0#{hour}#{minutes}"
  else
    return "#{hour.to_i+12}#{minutes}"
  end
end

# Instructor: Esteban O Mazzoni, Gloria Coruzzi, Katie Schneider, Patrick Eichenberger
def parse_section_instructors sec_instructor_string
  title_len = 12 # "Instructor: ".size
  sec_instructor_string[title_len..].split(/, /)
end

