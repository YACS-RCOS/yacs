require 'csv'
require 'open-uri'

class TopicsCsvClient

  def initialize term_shortname
    @url = ENV["CSV_SOURCE_#{term_shortname}"]
  end

  def courses
    return [] unless @url
    content = open(@url).read
    puts content
    csv = CSV.parse(content)
    courses = csv[1..-1].map{|row| Hash[csv[0].zip(row)]}.reject{|c| !c['subject'] || !c['number']}
    courses.map! do |course|
      if course['prerequisites']
        course['description'] = "#{course['description']} Prerequisites: #{course['prerequisites']}"
      end
      course['min_credits'] = course['max_credits'] = course['credits']
      course['tags'] = ['topics']
      course.compact!
      course_numbers = course['number'].split('/')
      course_numbers.map{|number| course.merge({'number' => number})}
    end
    courses.flatten!
  end

  def courses_by_subject
    subjects = {}
    courses.each do |course|
      subjects[course['subject']] ||= []
      subjects[course['subject']] << course
      course.delete 'subject'
    end
    subjects.map { |k, v| { code: k, courses: v } }
  end
end
