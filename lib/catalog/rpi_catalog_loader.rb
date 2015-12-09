require 'open-uri'
class RpiCatalogLoader < AbstractCatalogLoader
  public
  def load_catalog
    load_departments
    load_courses
  end

  # private
  def get_courses
    uri = "https://sis.rpi.edu/reg/rocs/201601.xml"
    @courses_xml ||= Nokogiri::XML(open(uri)).xpath("//COURSE")
  end

  def load_courses
    get_courses
    courses_xml.each do |course_xml|
      dept = Department.where(code: course_xml[:dept])[0]
      course              = dept.courses.build
      course.name         = course_xml[:name]
      course.number       = course_xml[:num]
      course.min_credits  = course_xml[:credmin]
      course.max_credits  = course_xml[:credmax]
      course.save!
      puts course.inspect
      sections_xml = course_xml.xpath(:section)
      sections_xml.each do |section_xml|
        section             = course.sections.build
        section.name        = section_xml[:name]
        section.crn         = section_xml[:crn]
        section.seats       = section_xml[:seats]
        section.seats_taken = section_xml[:seats_taken]
      end
    end
  end

  def load_departments
    file = "departments.txt"
    File.readlines(file).drop(1).each do |line|
      data = line.strip.split(/\t/)
      puts "#{data[0]} - #{data[1]}"
      Department.create(code: data[0], name: data[1])
    end
  end
end