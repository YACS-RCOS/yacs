require 'open-uri'
class Catalog::RpiAdapter < Catalog::AbstractAdapter
  public
  def load_catalog
    unless Section.count.zero? && Course.count.zero? && Department.count.zero? && School.count.zero?
      raise "ERROR: Database must be empty!"
    end
    load_departments
    load_schools
    load_courses
    load_descriptions
    remove_empty
  end

  def update_catalog
    update_courses
    update_section_seats
  end

  def destroy_catalog
    Section.destroy_all
    Course.destroy_all
    Department.destroy_all
    School.destroy_all
  end

  def update_section_seats
    uri = "https://sis.rpi.edu/reg/rocs/YACS_#{sem_string}.xml"
    sections = Nokogiri::XML(open(uri)).xpath("//CourseDB/SECTION")
    sections.each do |section_xml|
      section = Section.find_by_crn(section_xml.attr("crn"))
      if section
        seats = section_xml.attr("seats").to_i
        seats_taken = section_xml.attr("students").to_i
        if section.seats != seats
          puts "#{section.id}: #{section.seats} -> #{seats}"
          section.update_attribute(:seats, seats)
        end
        if section.seats_taken != seats_taken
          puts "#{section.id}: #{section.seats_taken} -> #{seats_taken}"
          section.update_attribute(:seats_taken, seats_taken)
        end
      end
    end
  end
  
  private
  def sem_string
    "201609"
  end

  def load_courses
    errors = []
    uri = "https://sis.rpi.edu/reg/rocs/#{sem_string}.xml"
    @courses_xml = Nokogiri::XML(open(uri)).xpath("//COURSE")
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
              section.periods_day   .push(day_xml.text.to_i + 1)
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

  def update_courses
    errors = []
    uri = "https://sis.rpi.edu/reg/rocs/#{sem_string}.xml"
    @courses_xml = Nokogiri::XML(open(uri)).xpath("//COURSE")
    @courses_xml.each do |course_xml|
      dept = Department.where(code: course_xml[:dept])[0]
      course = dept.courses.find_by_number(course_xml[:num])
      if course.nil?
        course              = dept.courses.build
        course.name         = course_xml[:name].titleize
        course.number       = course_xml[:num]
        course.min_credits  = course_xml[:credmin]
        course.max_credits  = course_xml[:credmax]
        next unless course.save
        puts "course added - #{course.inspect}"
      end
      sections_xml = course_xml.xpath("SECTION")
      sections_xml.each do |section_xml|
        section = course.sections.find_by_crn(section_xml[:crn])
        if section.nil?
          section           = course.sections.build 
          puts "section added to #{course.inspect} - #{section.inspect}"
        end
        section.name        = section_xml[:num]
        section.crn         = section_xml[:crn]
        section.seats       = section_xml[:seats]
        section.seats_taken = section_xml[:students]
        section.num_periods = 0
        periods_xml = section_xml.xpath("PERIOD")
        section.instructors = instructors = []
        section.periods_day = section.periods_start = section.periods_end = section.periods_type = []
        periods_xml.each do |period_xml|
          section.instructors.concat(period_xml[:instructor].strip.split(/\//))
          days_xml = period_xml.xpath("DAY")
          days_xml.each do |day_xml|
            section.num_periods += 1
            section.periods_day   .push(day_xml.text.to_i + 1)
            section.periods_start .push(period_xml[:start])
            section.periods_end   .push(period_xml[:end])
            section.periods_type  .push(period_xml[:type])
          end
        end
        section.instructors.delete("Staff")
        section.instructors.uniq!
        section.save!
      end
    end
    puts errors
  end

  def load_descriptions
    base = "http://catalog.rpi.edu/"
    page_no = 1
    while page_no <= 20 do
      path = "content.php?catoid=14&catoid=14&navoid=336&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1&filter%5Bcpage%5D="+page_no.to_s+"#acalog_template_course_filter"
      page = base + path
      page = Nokogiri::HTML(open(page))
      page_no += 1
      rows = page.css('td.block_content table tr')
      rows[1..-2].each do |row|
        courses = row.css('td a').to_a.compact
        courses.each do |course|
          href = course['href']
          course_title = course.text.sub(/-.*/, '').strip.split
          course_name = course.text.split('-')[1..-1].join('-').gsub(/[^ -\~]/, '').strip
          course_model = Course.where(number: course_title[1]).includes(:department).where(departments: {code: course_title[0]})[0]
          if course_model
            desc_path = base + href
            desc_page = Nokogiri::HTML(open(desc_path))
            desc_page.search('h1').remove
            desc = desc_page.css('td.block_content')
            course_description = desc.text
            course_description.slice! "HELP"
            course_description.slice! "Rensselaer Catalog 2015-2016"
            course_description.slice! "Print-Friendly Page [Add to Portfolio]"
            course_description.slice! " Back to Top | Print-Friendly Page [Add to Portfolio]"
            course_description = course_description.strip
            puts "#{course_title} - #{course_description}"
            course_model.update_attributes!(description: course_description) if course_description.present?
            course_model.update_attributes!(name: course_name) if course_name.present?
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