require 'csv'
require 'open-uri'

class TopicsCsvClient

  def initialize url
    @url = url
  end

  def courses
    content = open(@url).read
    csv = CSV.parse(content)
    courses = csv[1..-1].map{|row| Hash[csv[0].zip(row)]}.reject{|c| !c['department'] || !c['number']}
    courses.map! do |course|
      if course['prerequisites']
        course['description'] = "#{course['description']} Prerequisites: #{course['prerequisites']}"
      end
      course['min_credits'] = course['max_credits'] = course['credits']
      course.compact!
      course_numbers = course['number'].split('/')
      course_numbers.map{|number| course.merge({'number' => number})}
    end
    courses.flatten!
  end

  def courses_by_department
    departments = {}
    courses.each do |course|
      departments[course['department']] ||= []
      departments[course['department']] << course
      course.delete 'department'
    end
    departments.map { |k, v| { code: k, courses: v } }
  end
end
