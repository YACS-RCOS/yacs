require 'open-uri'
class Catalog::RpiCatalogLoader < Catalog::AbstractCatalogLoader
  public
  def load_catalog
    load_departments
    load_courses
  end

  private
  def get_courses
    uri = "https://sis.rpi.edu/reg/rocs/201601.xml"
    @courses_xml ||= Nokogiri::XML(open(uri)).xpath("//COURSE")
  end

  def load_courses
    errors = []
    get_courses
    @courses_xml.each do |course_xml|
      dept = Department.where(code: course_xml[:dept])[0]
      course              = dept.courses.build
      course.name         = course_xml[:name].titleize
      course.number       = course_xml[:num]
      course.min_credits  = course_xml[:credmin]
      course.max_credits  = course_xml[:credmax]
      if course.save
        puts course.inspect
        sections_xml = course_xml.xpath("SECTION")
        sections_xml.each do |section_xml|
          section             = course.sections.build
          section.name        = section_xml[:num]
          section.crn         = section_xml[:crn]
          section.seats       = section_xml[:seats]
          section.seats_taken = section_xml[:students]
          section.num_periods = 0
          periods_xml = section_xml.xpath("PERIOD")
          section.instructors = instructors = []
          periods_xml.each do |period_xml|
            section.instructors.concat(period_xml[:instructor].strip.split(/\//))
            days_xml = period_xml.xpath("DAY")
            days_xml.each do |day_xml|
              section.num_periods += 1
              section.periods_day   .push(day_xml.text)
              section.periods_start .push(period_xml[:start])
              section.periods_end   .push(period_xml[:end])
              section.periods_type  .push(period_xml[:type])
            end
          end
          section.instructors.delete("Staff")
          section.instructors.uniq!
          section.save!
        end
      else
        errors << "#{dept.code} - #{course.number}"
      end
    end
    puts errors
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