require 'open-uri'
class Catalog::RpiCatalogLoader < Catalog::AbstractCatalogLoader
  public
  def load_catalog
    load_departments
    load_schools
    load_courses
    load_descriptions
    remove_empty
  end

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

  def load_descriptions
    base = "http://catalog.rpi.edu/"
    page_no = 1
    while page_no <= 20 do
      path = "content.php?catoid=14&catoid=14&navoid=336&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1&filter%5Bcpage%5D="+$page_no.to_s+"#acalog_template_course_filter"
      page = base + path
      page = Nokogiri::HTML(open(page))
      page_no += 1

      rows = page.css('td.block_content table tr')
      rows[1..-2].each do |row|
        courses = row.css('td a').to_a.compact
        courses.each do |course|
          href = course['href']
          course_title = course.text.sub(/-.*/, '').strip.split
          course_model = Course.where(number: course_title[1]).includes(:department).where(departments: {code: course_title[0]})[0]
          if course_model
            desc_path = base + href
            desc_page = Nokogiri::HTML(open(desc_path))
            desc = desc_page.css('td.block_content')
            course_description = desc.text
            course_description.slice! "HELP"
            course_description.slice! "Rensselaer Catalog 2015-2016"
            course_description.slice! "Print-Friendly Page [Add to Portfolio]"
            course_description.slice! " Back to Top | Print-Friendly Page [Add to Portfolio]"
            course_description = course_description.strip
            puts "#{course_title} - #{course_description}"
            course_model.update_attributes!(description: course_description)
          end
        end
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

  def load_schools
    file = "schools.txt"
    File.readlines(file).each do |line|
      data = line.strip.split(/\t/)
      school = School.create!(name: data[0])
      data.drop(1).each do |code|
        department = Department.where(code: code)[0]
        department.update_attributes!(school_id: school.id)
      end
    end
  end

  def remove_empty
    other = School.find_or_create_by(name: "Other")
    empty = []
    Department.all.each do |department|
      empty << department if department.courses.empty?
      department.update_attributes(school_id: other.id) if department.school_id == nil
    end
    empty.each { |e| e.destroy! }
  end
end