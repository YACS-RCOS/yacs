require 'open-uri'
require 'ruby-progressbar'
class Catalog::RpiAdapter < Catalog::AbstractAdapter
  public

  def load_catalog
    # Temporarily supress db output
    log_level = ActiveRecord::Base.logger.level
    ActiveRecord::Base.logger.level = 2
    # Do stuff
    load_departments
    load_schools
    load_courses_and_sections
    # load_descriptions
    remove_empty
    # Return logging to normal
    ActiveRecord::Base.logger.level = log_level
  end

  # def load_catalog
  #   unless Section.count.zero? && Course.count.zero? && Department.count.zero? && School.count.zero?
  #     raise 'ERROR: Database must be empty!'
  #   end
  #   load_departments
  #   load_schools
  #   load_courses
  #   load_descriptions
  #   remove_empty
  # end

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

  private

  def sem_string
    '201609'
  end

  # LOAD ACTIONS
  # ===============================================
  def load_departments
    # Gets a list of db departments,
    # Gets a list of xml departments,
    dbDepartments = Department.all.map { |x| { code: x.code, name: x.name } }
    xmlDepartments = []
    file = 'departments.txt'
    puts "\e[95m" << "Departments" << "\e[0m"
    progressbar = ProgressBar.create(total: File.readlines(file).length)
    File.readlines(file).drop(1).each do |line|
      progressbar.increment
      data = line.strip.split(/\t/)
      # puts "#{data[0]} - #{data[1]}"s

      # build the list of XML departments
      tmpDepartment = Department.new(code: data[0], name: data[1])
      xmlDepartments << { code: tmpDepartment.code, name: tmpDepartment.name }

      # Save unless found, where different
      fndDepartment = Department.where(name: tmpDepartment.name, code: tmpDepartment.code).first
      if fndDepartment
        fndDepartment.update!(tmpDepartment.attributes.except('id', 'created_at', 'updated_at')) if fndDepartment.diff?(tmpDepartment)
      else
        tmpDepartment.save!
      end
    end
    # Compare lists, destroy old records if found
    progressbar.finish
    toReject = dbDepartments - xmlDepartments
    puts "\tCreated+ " << (xmlDepartments - dbDepartments).length.to_s
    puts "\tDeleted- " << (toReject).length.to_s
    puts "\t\e[36m" <<"Total= " << "\e[0m" << Department.count.to_s
    if toReject
      toReject.each do |dpt|
        Department.where(code: dpt[:code], name: dpt[:name]).first.destroy!
      end
    end
  end

  def load_schools
    # Gets a list of db schools,
    # Gets a list of xml schools,
    dbSchools = School.all.map { |x| { name: x.name } }
    xmlSchools = []
    file = 'schools.txt'
    puts "\e[95m" <<"Schools" << "\e[0m"
    progressbar = ProgressBar.create(total: File.readlines(file).length)
    File.readlines(file).each do |line|
      progressbar.increment
      data = line.strip.split(/\t/)
      tmpSchool = School.new(name: data[0])
      xmlSchools << { name: tmpSchool.name }

      # Save unless found, where different
      fndSchool = School.where(name: tmpSchool.name).first
      if fndSchool
        fndSchool.update!(tmpSchool.attributes.except('id', 'created_at', 'updated_at')) if fndSchool.diff?(tmpSchool)
      else
        tmpSchool.save!
      end

      data.drop(1).each do |code|
        tmpDepartment = Department.where(code: code).first
        tmpDepartment.update!(school_id: tmpSchool.id) if tmpDepartment.school_id != tmpSchool.id
      end
    end
    progressbar.finish
    # Compare lists, destroy old records if found
    toReject = dbSchools - xmlSchools
    puts "\tCreated+ " << (xmlSchools - dbSchools).length.to_s
    puts "\tDeleted- " << (toReject).length.to_s
    puts "\t\e[36m" <<"Total= " << "\e[0m" << School.count.to_s
    if toReject
      toReject.each do |sch|
        School.where(name: sch[:name]).first.destroy!
      end
    end
  end

  def load_courses_and_sections
    errors = []
    uri = "https://sis.rpi.edu/reg/rocs/#{sem_string}.xml"
    puts "\e[95m" <<"Courses and Sections" << "\e[0m"

    # Compose lists of courses and sections for comparison later
    dbCourses = Course.all.map { |x| { number: x.number } }
    xmlCourses = []
    dbSections = Section.all.map { |x| { name: x.name, crn: x.crn } }
    xmlSections = []
    @courses_xml = Nokogiri::XML(open(uri)).xpath('//COURSE')
    progressbar = ProgressBar.create(total: @courses_xml.length)
    @courses_xml.each do |course_xml|
      progressbar.increment
      # Each department has its own list of courses
      dept = Department.where(code: course_xml[:dept]).first

      tmpCourse              = dept.courses.build
      tmpCourse.name         = course_xml[:name].titleize
      tmpCourse.number       = course_xml[:num]
      tmpCourse.min_credits  = course_xml[:credmin]
      tmpCourse.max_credits  = course_xml[:credmax]
      xmlCourses << {number: tmpCourse.number}

      # Save unless found, where different
      fndCourse = Course.where({number: tmpCourse.number}).first
      if fndCourse
        fndCourse.update!(tmpCourse.attributes.except('id', 'number', 'created_at', 'updated_at', 'description')) if fndCourse.diff?(tmpCourse)

      else
        if tmpCourse.save!
          # puts tmpCourse.inspect
          sections_xml = course_xml.xpath('SECTION')
          sections_xml.each do |section_xml|
            tmpSection = tmpCourse.sections.build
            tmpSection.name        = section_xml[:num]
            tmpSection.crn         = section_xml[:crn]
            tmpSection.seats       = section_xml[:seats]
            tmpSection.seats_taken = section_xml[:students]
            tmpSection.num_periods = 0
            periods_xml = section_xml.xpath('PERIOD')
            tmpSection.instructors = instructors = []
            periods_xml.each do |period_xml|
              tmpSection.instructors.concat(period_xml[:instructor].strip.split(/\//))
              days_xml = period_xml.xpath('DAY')
              days_xml.each do |day_xml|
                tmpSection.num_periods += 1
                tmpSection.periods_day   .push(day_xml.text.to_i + 1)
                tmpSection.periods_start .push(period_xml[:start])
                tmpSection.periods_end   .push(period_xml[:end])
                tmpSection.periods_type  .push(period_xml[:type])
              end
              tmpSection.instructors.delete('Staff')
              tmpSection.instructors.uniq!
              xmlSections << {name: tmpSection.name, crn: tmpSection.crn}

              # Check if the section already exists
              fndSection = Section.where(name: tmpSection.name, crn: tmpSection.crn).first
              if fndSection
                fndSection.update!(tmpSection.attributes.except('id', 'created_at', 'updated_at')) if fndSection.diff?(tmpSection)
              else
                tmpSection.save!
              end

            end
          end
        else
          errors << "#{dept.code} - #{tmpCourse.number}"
        end
      end
    end
    progressbar.finish
    # Compare lists of Courses, destroy old records if found
    puts "\t\e[95m" <<"Courses" << "\e[0m"
    puts "\t======================================="
    toRejectCourses = dbCourses - xmlCourses
    puts "\t\tCreated+ " << (xmlCourses - dbCourses).length.to_s
    puts "\t\tDeleted- " << (toRejectCourses).length.to_s
    puts "\t\t\e[36m" <<"Total= " << "\e[0m" << Course.all.length.to_s
    if toRejectCourses
      toRejectCourses.each do |crs|
        Course.where(number: crs[:number]).first.destroy!
      end
    end
    # Compare lists of Sections, destroy old records if found
    puts "\t\e[95m" <<"Sections" << "\e[0m"
    puts "\t======================================="
    toRejectSections = dbSections - xmlSections
    puts "\t\tCreated+ " << (xmlSections - dbSections).length.to_s
    puts "\t\tDeleted- " << (toRejectSections).length.to_s
    puts "\t\t\e[36m" <<"Total= " << "\e[0m" << Section.count.to_s
    if toRejectSections
      toRejectSections.each do |sec|
        Section.where(name: sec[:name], crn: sec[:crn]).first.destroy!
      end
    end
    puts errors unless errors.empty?
  end

  def load_descriptions
    base = 'http://catalog.rpi.edu/'
    page_no = 1
    xmlDescriptions=[]

    puts "\e[95m" <<"Descriptions" << "\e[0m"
    progressbar = ProgressBar.create(total: Course.count)
    while page_no <= 20
      path = 'content.php?catoid=14&catoid=14&navoid=336&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1&filter%5Bcpage%5D=' + page_no.to_s + '#acalog_template_course_filter'
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
          course_model = Course.where(number: course_title[1]).includes(:department).where(departments: { code: course_title[0] }).first
          next unless course_model
          progressbar.increment
          desc_path = base + href# + '&print'
          # FIXME THIS TAKES A LONG TIME vvvvvvvv
          desc_page = Nokogiri::HTML(open(desc_path))
          # FIXME THIS TAKES A LONG TIME ^^^^^^^^
          desc_page.search('h1').remove
          desc = desc_page.css('td.block_content')
          course_description = desc.text
          course_description.slice! 'HELP'
          course_description.slice! 'Rensselaer Catalog 2015-2016'
          course_description.slice! 'Print-Friendly Page [Add to Portfolio]'
          course_description.slice! ' Back to Top | Print-Friendly Page [Add to Portfolio]'
          course_description = course_description.strip
          if course_description.present? && (course_model.description != course_description)
            course_model.update!(description: course_description)
            xmlDescriptions <<  "#{course_title} - #{course_description}"
          end
          course_model.update!(name: course_name) if course_name.present? && course_model.name != course_name
        end
      end
    end
    progressbar.finish
    puts "\tCreated+ " << xmlDescriptions.length.to_s
  end

  def load_descriptions2
    base = 'http://catalog.rpi.edu/'
    page_no = 1
    xmlDescriptions=[]
    while page_no <= 20
      path = 'content.php?catoid=14&catoid=14&navoid=336&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1&filter%5Bcpage%5D=' + page_no.to_s + '#acalog_template_course_filter'
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
          course_model = Course.where(number: course_title[1]).includes(:department).where(departments: { code: course_title[0] })[0]
          next unless course_model
          desc_path = base + href
          puts desc_path
          t1= Time.now
          desc_page = Nokogiri::HTML(open(desc_path))
          desc_page.search('h1').remove
          desc = desc_page.css('td.block_content')
          t2= Time.now
          ap '-------'
          ap (t2-t1)
          t1= Time.now
          course_description = desc.text
          course_description.slice! 'HELP'
          course_description.slice! 'Rensselaer Catalog 2015-2016'
          course_description.slice! 'Print-Friendly Page [Add to Portfolio]'
          course_description.slice! ' Back to Top | Print-Friendly Page [Add to Portfolio]'
          course_description = course_description.strip
          t2= Time.now
          ap (t2-t1)
          if course_description.present? && course_model.description != course_description
            course_model.update!(description: course_description)
            xmlDescriptions <<  "#{course_title} - #{course_description}"
          end
          course_model.update!(name: course_name) if course_name.present? && course_model.name != course_name
        end
      end
    end
    ap 'Descriptions'
    ap '======================================='
    puts "\tCreated+ " << xmlDescriptions.length.to_s
  end

# ]
# 2.2.3 :005 > Department.count
#  (0.7ms)  SELECT COUNT(*) FROM "departments"
# 42
# 2.2.3 :006 > School.count
#  (2.1ms)  SELECT COUNT(*) FROM "schools"
# 7
# 2.2.3 :007 > Course.count
#  (2.6ms)  SELECT COUNT(*) FROM "courses"
# 910
# 2.2.3 :008 > Section.count
#  (1.0ms)  SELECT COUNT(*) FROM "sections"
# 2051
# 2.2.3 :009 >


  # UPDATE ACTIONS
  # ===============================================
  # def update_courses
  #   errors = []
  #   # Call API for XML of courses;
  #   uri = "https://sis.rpi.edu/reg/rocs/#{sem_string}.xml"
  #   @courses_xml = Nokogiri::XML(open(uri)).xpath('//COURSE')
  #   # Iterate through each course of parsed XML;
  #   @courses_xml.each do |course_xml|
  #     dept = Department.where(code: course_xml[:dept])[0]
  #     course = dept.courses.find_by_number(course_xml[:num])
  #     found_course = course
  #     # If course does not exist, add course;
  #     if course.nil?
  #       course              = dept.courses.build
  #       course.name         = course_xml[:name].titleize
  #       course.number       = course_xml[:num]
  #       course.min_credits  = course_xml[:credmin]
  #       course.max_credits  = course_xml[:credmax]
  #       next unless course.save
  #       puts "course added - #{course.inspect}"
  #     elsif found_course.diff?(course)
  #       # If course is found, check for differences
  #       course              = dept.courses.build
  #       # Ignore course name since it is scraped from RPI catalog, not SIS XML;
  #       #course.name         = course_xml[:name].titleize
  #       course.number       = course_xml[:num]
  #       course.min_credits  = course_xml[:credmin]
  #       course.max_credits  = course_xml[:credmax]
  #       found_course.update(course)
  #     end
  #
  #     sections_xml = course_xml.xpath('SECTION')
  #     # Iterate through each section within the course;
  #     sections_xml.each do |section_xml|
  #       section = course.sections.where( name: section_xml[:name], crn: section_xml[:crn])
  #       found_section = section
  #       # If specific section within does not exist, add section;
  #       if section.nil?
  #         section = course.sections.build
  #         puts "section added to #{course.inspect} - #{section.inspect}"
  #       end
  #       section.name        = section_xml[:num]
  #       section.crn         = section_xml[:crn]
  #       section.seats       = section_xml[:seats]
  #       section.seats_taken = section_xml[:students]
  #       section.num_periods = 0
  #       periods_xml = section_xml.xpath('PERIOD')
  #       section.instructors = instructors = []
  #       section.periods_day = section.periods_start = section.periods_end = section.periods_type = []
  #       periods_xml.each do |period_xml|
  #         section.instructors.concat(period_xml[:instructor].strip.split(/\//))
  #         days_xml = period_xml.xpath('DAY')
  #         days_xml.each do |day_xml|
  #           section.num_periods += 1
  #           section.periods_day   .push(day_xml.text.to_i + 1)
  #           section.periods_start .push(period_xml[:start])
  #           section.periods_end   .push(period_xml[:end])
  #           section.periods_type  .push(period_xml[:type])
  #         end
  #       end
  #       section.instructors.delete('Staff')
  #       section.instructors.uniq!
  #       # Update found section if there is one, else just save the section
  #       if !found_section.nil?
  #         found_section.update(section) if found_section.diff?(section)
  #       else
  #         section.save!
  #       end
  #     end
  #   end
  #   puts errors
  # end

  # def update_section_seats
  #   uri = "https://sis.rpi.edu/reg/rocs/YACS_#{sem_string}.xml"
  #   sections = Nokogiri::XML(open(uri)).xpath('//CourseDB/SECTION')
  #   sections.each do |section_xml|
  #     section = Section.where(crn: section_xml.attr('crn'), name: section_xml.attr('name'))
  #     next unless section
  #     seats = section_xml.attr('seats').to_i
  #     seats_taken = section_xml.attr('students').to_i
  #     if section.seats != seats
  #       puts "#{section.id}: #{section.seats} -> #{seats}"
  #       section.update_attribute(:seats, seats)
  #     end
  #     if section.seats_taken != seats_taken
  #       puts "#{section.id}: #{section.seats_taken} -> #{seats_taken}"
  #       section.update_attribute(:seats_taken, seats_taken)
  #     end
  #   end
  # end

  # CLEANUP ACTIONS
  # ===============================================
  def remove_empty
    other = School.find_or_create_by(name: 'Other')
    empty = []
    Department.all.each do |department|
      empty << department if department.courses.empty?
      department.update_attributes(school_id: other.id) if department.school_id.nil?
    end
    empty.each(&:destroy!)
  end
end
