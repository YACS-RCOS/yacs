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
    load_descriptions
    remove_empty
    # Return logging to normal
    ActiveRecord::Base.logger.level = log_level
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
    # Initialize environment
    file = 'departments.txt'

    # Display formatting
    puts "\e[95m" << 'Departments' << "\e[0m"
    progressbar = ProgressBar.create(total: File.readlines(file).length)

    # Create sets to hold entities for logging and debug
    dbDepartments   = Set.new Department.all.map { |x| { code: x.code, name: x.name } }
    xmlDepartments  = Set.new
    modDepartments  = Set.new
    errDepartments  = Set.new

    File.readlines(file).drop(1).each do |line|
      progressbar.increment

      # Read the data from the XML and track it
      data = line.strip.split(/\t/)
      tmpDepartment = Department.new(code: data[0], name: data[1])
      xmlDepartments << { code: tmpDepartment.code, name: tmpDepartment.name }

      # Update or Create
      fndDepartment = Department.where(name: tmpDepartment.name, code: tmpDepartment.code).first
      begin
        if fndDepartment
          if fndDepartment.diff?(tmpDepartment)
            if fndDepartment.update!(tmpDepartment.attributes.except('id', 'created_at', 'updated_at'))
              modDepartments << { code: tmpDepartment.code, name: tmpDepartment.name }
            end
          end
        else
          tmpDepartment.save!
        end
      rescue
        errDepartments << { code: tmpDepartment.code, name: tmpDepartment.name }
      end
    end

    # Compare lists, destroy old records if found
    progressbar.finish
    toReject = dbDepartments - xmlDepartments
    puts "\tCreated + " << (xmlDepartments - dbDepartments).length.to_s
    puts "\tDeleted - " << toReject.length.to_s
    puts "\tModified~ " << modDepartments.length.to_s
    puts "\tErrored ! " << errDepartments.length.to_s
    puts "\t\e[36m" << 'Total= ' << "\e[0m" << Department.count.to_s
    if toReject
      toReject.each do |dpt|
        Department.where(code: dpt[:code], name: dpt[:name]).first.destroy!
      end
    end
  end

  def load_schools
    # Initialize environment
    file = 'schools.txt'

    # Display formatting
    puts "\e[95m" << 'Schools' << "\e[0m"
    progressbar = ProgressBar.create(total: File.readlines(file).length)

    # Create sets to hold entities for logging and debug
    dbSchools   = Set.new School.all.map { |x| { name: x.name } }
    xmlSchools  = Set.new
    modSchools  = Set.new
    errSchools  = Set.new

    File.readlines(file).each do |line|
      progressbar.increment

      # Read the data from the XML and track it
      data = line.strip.split(/\t/)
      tmpSchool = School.new(name: data[0])
      xmlSchools << { name: tmpSchool.name }

      # Update or Create
      fndSchool = School.where(name: tmpSchool.name).first
      begin
        if fndSchool
          if fndSchool.diff?(tmpSchool)
            if fndSchool.update!(tmpSchool.attributes.except('id', 'created_at', 'updated_at'))
              modSchools << { name: tmpSchool.name }
            end
          end
        else
          tmpSchool.save!
        end
      rescue
        errSchools << { name: tmpSchool.name }
      end

      data.drop(1).each do |code|
        tmpDepartment = Department.where(code: code).first
        tmpDepartment.update!(school_id: tmpSchool.id) if tmpDepartment.school_id != tmpSchool.id
      end
    end

    # Compare lists, destroy old records if found
    progressbar.finish
    toReject = dbSchools - xmlSchools
    puts "\tCreated + " << (xmlSchools - dbSchools).length.to_s
    puts "\tDeleted - " << toReject.length.to_s
    puts "\tModified~ " << modSchools.length.to_s
    puts "\tErrored ! " << errSchools.length.to_s
    puts "\t\e[36m" << 'Total= ' << "\e[0m" << School.count.to_s
    if toReject
      toReject.each do |sch|
        School.where(name: sch[:name]).first.destroy!
      end
    end
  end

  def load_courses_and_sections
    # Initialize environment
    uri = "https://sis.rpi.edu/reg/rocs/#{sem_string}.xml"
    @courses_xml = Nokogiri::XML(open(uri)).xpath('//COURSE')

    # Display formatting about what we are doing
    puts "\e[95m" << 'Courses and Sections' << "\e[0m"
    progressbar = ProgressBar.create(total: @courses_xml.length)

    # Create sets to hold entities for logging and debug
    dbCourses   = Set.new Course.all.includes(:sections).map { |crs| { number: crs.number, department_id: crs.department_id } }
    xmlCourses  = Set.new
    modCourses  = Set.new
    errCourses  = Set.new

    dbSections  = Set.new Section.all.map { |sec| { name: sec.name, crn: sec.crn, course_id: sec.course_id } }
    xmlSections = Set.new
    modSections = Set.new
    errSections = Set.new

    @courses_xml.each do |course_xml|
      progressbar.increment

      # Read the data from the XML and track it
      dept = Department.where(code: course_xml[:dept])[0]
      tmpCourse              = dept.courses.build
      tmpCourse.name         = course_xml[:name].titleize
      tmpCourse.number       = course_xml[:num]
      tmpCourse.min_credits  = course_xml[:credmin]
      tmpCourse.max_credits  = course_xml[:credmax]
      xmlCourses << { number: tmpCourse.number, department_id: dept.id }

      # Update or Create
      fndCourse = Course.includes(:sections).where(number: tmpCourse.number, department_id: tmpCourse.department_id).first
      sections_xml = course_xml.xpath('SECTION')
      if !fndCourse.nil?
        if fndCourse.diff?(tmpCourse)
          if fndCourse.update!(tmpCourse.attributes.except('id', 'name', 'created_at', 'updated_at'))
            modCourses << { number: tmpCourse.number, department_id: dept.id }
            # Load sections from fndCourse
            sections_xml.each do |section_xml|
              load_section(fndCourse, section_xml, xmlSections, modSections, errSections)
            end
          else
            errCourses << { number: tmpCourse.number, department_id: dept.id }
          end
        end
      else
        if tmpCourse.save
          # Load sections from tmpCourse
          sections_xml.each do |section_xml|
            load_section(tmpCourse, section_xml, xmlSections, modSections, errSections)
          end
        else
          errCourses << { number: tmpCourse.number, department_id: dept.id }
        end
      end
    end

    # PRINT REJECTED COURSES
    progressbar.finish
    puts '==============='
    puts 'Courses'
    # Compare lists, destroy old records if found
    toRejectCourses = (dbCourses - xmlCourses)- errCourses
    puts "\tCreated + " << ((xmlCourses - dbCourses) - errCourses).length.to_s
    puts "\tDeleted - " << toRejectCourses.length.to_s
    puts "\tModified~ " << modCourses.length.to_s
    puts "\tErrored ! " << errCourses.length.to_s
    puts "\t\e[36m" << 'Total= ' << "\e[0m" << Course.count.to_s
    if toRejectCourses
      toRejectCourses.each do |crs|
        Course.where({ name: crs[:name], department_id: crs[:department_id] }).first.destroy!
      end
    end

    # PRINT REJECTED SECTIONS
    # Compare lists, destroy old records if found
    puts '==============='
    puts 'Sections'
    # ap dbSections
    toRejectSections = (dbSections - xmlSections) - errSections
    puts "\tCreated + " << ((xmlSections - dbSections)- errSections).length.to_s
    puts "\tDeleted - " << toRejectSections.length.to_s
    puts "\tModified~ " << modSections.length.to_s
    puts "\tErrored ! " << errSections.length.to_s
    puts "\t\e[36m" << 'Total= ' << "\e[0m" << Section.count.to_s
    # ap toRejectSections
    if toRejectSections
      toRejectSections.each do |sec|
        Section.where( name: sec[:name], crn: sec[:crn], course_id: sec[:course_id] ).first.destroy!
      end
    end
  end

  def load_section(course, section_xml, xmlSections, modSections, errSections)
    # Read the data from the XML and track it
    tmpSection             = Section.new({course_id: course.id})
    tmpSection.name        = section_xml[:num]
    tmpSection.crn         = section_xml[:crn]
    tmpSection.seats       = section_xml[:seats]
    tmpSection.seats_taken = section_xml[:students]
    tmpSection.num_periods = 0
    periods_xml            = section_xml.xpath('PERIOD')
    tmpSection.instructors = instructors = []

    # Build a list of periods from xmlSections
    periods_xml.each do |period_xml|
      tmpSection.instructors.concat(period_xml[:instructor].strip.split(/\//))
      days_xml = period_xml.xpath('DAY')
      days_xml.each do |day_xml|
        tmpSection.num_periods += 1
        tmpSection.periods_day   .push(day_xml.text.to_i + 1)
        tmpSection.periods_start .push(period_xml[:start].to_i)
        tmpSection.periods_end   .push(period_xml[:end].to_i)
        tmpSection.periods_type  .push(period_xml[:type])
      end
    end
    # Validate the section
    tmpSection.instructors.delete('Staff')
    tmpSection.instructors.uniq!
    xmlSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: course.id }

    # Update or create
    fndSection = Section.where(name: tmpSection.name, crn: tmpSection.crn, course_id: tmpSection.course_id).first
    # We want to skip this if we don't have a full match, it'll be created later
    if fndSection.nil? && !Section.where(name: tmpSection.name, course_id: tmpSection.course_id).first.nil?
      fndSection = Section.where(name: tmpSection.name, course_id: tmpSection.course_id).first
      errSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: course.id }
    end
    if fndSection
      if fndSection.diff?(tmpSection)
        if fndSection.update(tmpSection.attributes.except('id', 'created_at', 'updated_at'))
          modSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: course.id }
        else
          errSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: course.id }
        end
      end
    else
      unless tmpSection.save
        errSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: course.id }
      end
    end
  end

  def load_descriptions
    # Initialize environment
    base = 'http://catalog.rpi.edu/'
    page_no = 1

    # Display formatting
    puts "\e[95m" <<"Descriptions" << "\e[0m"
    progressbar = ProgressBar.create(total: Course.count)

    # Sets for debug and logging
    xmlDescriptions = []
    modCourses      = Set.new

    while page_no <= 20
      # Initialize HTML scraper
      path = 'content.php?catoid=14&catoid=14&navoid=336&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1&filter%5Bcpage%5D=' + page_no.to_s + '#acalog_template_course_filter'
      page = base + path
      page = Nokogiri::HTML(open(page))
      page_no += 1
      rows = page.css('td.block_content table tr')

      # For each matched element
      rows[1..-2].each do |row|
        courses = row.css('td a').to_a.compact
        # For each course, modify the descriptions
        courses.each do |course|
          href = course['href']
          course_title = course.text.sub(/-.*/, '').strip.split
          course_name = course.text.split('-')[1..-1].join('-').gsub(/[^ -\~]/, '').strip
          course_model = Course.where(number: course_title[1]).includes(:department).where(departments: { code: course_title[0] }).first
          next unless course_model
          progressbar.increment

          # Once course is found to exist in DB, attempt to modify from web data
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
          course_description.slice! ' Back to Top | Print-Friendly Page [Add to Portfolio]'
          course_description = course_description.strip

          # Update descriptions
          if course_description.present? && (course_model.description != course_description)
            course_model.update!(description: course_description)
            xmlDescriptions << { course_number: course_model.number, course_description: course_description }
          end

          # Update course names if needed
          if course_name.present? && course_model.name != course_name
            modCourses << { course_number: course_model.number, course_name: course_name }
            course_model.update!(name: course_name)
          end

        end
      end
    end

    progressbar.finish
    puts "\tDescribed ~ " << xmlDescriptions.length.to_s
    puts "\tRenamed   ~ " << modCourses.length.to_s
  end


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
