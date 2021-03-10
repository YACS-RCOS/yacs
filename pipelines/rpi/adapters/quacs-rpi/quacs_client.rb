require 'httpclient'

class QuacsClient

  def initialize term_shortname
    @courses_uri = "https://raw.githubusercontent.com/quacs/quacs-data/master/semester_data/#{term_shortname}/courses.json"
    @http_client = HTTPClient.new
  end

  def sections
    get_json(@courses_uri).map do |dept| 
      dept["courses"].map do |course| 
        course["sections"].map do |section| 
          {
            :crn => section["crn"],
            :shortname => section["crse"],
            :seats => section["cap"],
            :seats_taken => section["act"],
          }
        end
      end
    end.flatten
  end

  def listings
    get_json(@courses_uri).map do |dept|
      dept["courses"].map do |course|
        sections = course["sections"]
        {
          :min_credits => sections[0]["credMin"],
          :max_credits => sections[0]["credMax"],
          :shortname => course["crse"],
          :longname => course["title"],
          :subject => { shortname: course["subj"] },
          :sections => extract_sections(sections)
        }
      end
    end.flatten
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

  def get_json uri
    JSON.parse(@http_client.get(uri).body)
  end

  def parse_instructors timeslot
    timeslot["instructor"].split(", ")
  end

  def parse_day day
    "MTWRF".index(day)
  end

  def parse_timeslot_day timeslot, day
    {
      :start => timeslot["timeStart"],
      :end => timeslot["timeEnd"],
      :instructor => parse_instructors(timeslot),
      :location => timeslot["location"],
      :day => parse_day(day),
    }
  end

  def parse_timeslots timeslots
    timeslots.map do |timeslot| 
      timeslot["days"].map do |day| 
        parse_timeslot_day timeslot, day
      end
    end.flatten
  end

  def extract_sections sections
    sections.map do |section| 
      {
        :shortname => section["crse"],
        :crn => section["crn"],
        :seats => section["cap"],
        :seats_taken => section["act"],
        :instructors => parse_instructors(section["timeslots"][0]),
        :periods => parse_timeslots(section["timeslots"]),
      }
    end
  end
end
