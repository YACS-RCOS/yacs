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
    dbDepartments = Set.new Department.all.map { |x| { code: x.code, name: x.name } }
    xmlDepartments = Set.new
    file = 'departments.txt'
    puts "\e[95m" << 'Departments' << "\e[0m"
    progressbar = ProgressBar.create(total: File.readlines(file).length)
    File.readlines(file).drop(1).each do |line|
      progressbar.increment
      data = line.strip.split(/\t/)
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
    puts "\tDeleted- " << toReject.length.to_s
    puts "\t\e[36m" << 'Total= ' << "\e[0m" << Department.count.to_s
    if toReject
      toReject.each do |dpt|
        Department.where(code: dpt[:code], name: dpt[:name]).first.destroy!
      end
    end
  end

  def load_schools
    # Gets a list of db schools,
    # Gets a list of xml schools,
    dbSchools = Set.new School.all.map { |x| { name: x.name } }
    xmlSchools = Set.new
    file = 'schools.txt'
    puts "\e[95m" << 'Schools' << "\e[0m"
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
    puts "\tDeleted- " << toReject.length.to_s
    puts "\t\e[36m" << 'Total= ' << "\e[0m" << School.count.to_s
    if toReject
      toReject.each do |sch|
        School.where(name: sch[:name]).first.destroy!
      end
    end
  end

  def load_courses_and_sections
    errCourses = Set.new
    uri = "https://sis.rpi.edu/reg/rocs/#{sem_string}.xml"
    @courses_xml = Nokogiri::XML(open(uri)).xpath('//COURSE')

    # Compose lists of courses and sections for comparison later
    dbCourses = Set.new Course.all.includes(:sections).map do |crs|
      {
        name: crs.name,
        department_id: crs.department_id,
        # sections: crs.sections.pluck(:name, :crn)
      }
    end
    xmlCourses = Set.new

    errSections= Set.new
    dbSections = Set.new Section.all.map do |sec|
      {
        name: sec.name,
        crn: sec.crn,
        course_id: sec.course_id
      }
    end
    xmlSections = Set.new

    # Display formatting about what we are doing
    puts "\e[95m" << 'Courses and Sections' << "\e[0m"
    progressbar = ProgressBar.create(total: @courses_xml.length)

    @courses_xml.each do |course_xml|
      progressbar.increment

      dept = Department.where(code: course_xml[:dept])[0]
      tmpCourse              = dept.courses.build
      tmpCourse.name         = course_xml[:name].titleize
      tmpCourse.number       = course_xml[:num]
      tmpCourse.min_credits  = course_xml[:credmin]
      tmpCourse.max_credits  = course_xml[:credmax]
      xmlCourses << { name: tmpCourse.name, department_id: dept.id }

      fndCourse = Course.includes(:sections).where(name: tmpCourse.name, department_id: tmpCourse.department_id).first
      sections_xml = course_xml.xpath('SECTION')
      if fndCourse
        if fndCourse.diff?(tmpCourse)
          if fndCourse.update!(tmpCourse.attributes.except('id', 'created_at', 'updated_at'))
            sections_xml.each do |section_xml|
              load_section(fndCourse, section_xml, xmlSections,errSections)
            end
          else
            errCourses << { name: tmpCourse.name, department_id: dept.id }
          end
        end
      else
        if tmpCourse.save
          sections_xml.each do |section_xml|
            load_section(tmpCourse, section_xml, xmlSections, errSections)
          end
        else
          errCourses << { name: tmpCourse.name, department_id: dept.id }
        end
      end
    end
    # PRINT REJECTED COURSES
    if errCourses
      # puts "There were #{errCourses.length} errors"
      # ap errCourses
    end
    progressbar.finish
    # Compare lists, destroy old records if found
    toRejectCourses = (dbCourses - xmlCourses)- errCourses
    puts "\tCreated+ " << ((xmlCourses - dbCourses) - errCourses).length.to_s
    puts "\tDeleted- " << toRejectCourses.length.to_s
    puts "\tErrors!  " << errCourses.length.to_s
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
    toRejectSections = (dbSections - xmlSections) - errSections
    puts "\tCreated+ " << ((xmlSections - dbSections)- errSections).length.to_s
    puts "\tDeleted- " << toRejectSections.length.to_s
    puts "\tErrors!  " << errSections.length.to_s
    puts "\t\e[36m" << 'Total= ' << "\e[0m" << Section.count.to_s
    ap toRejectSections
    if toRejectSections
      toRejectSections.each do |crs|
        Section.where({ name: crs[:name], department_id: crs[:department_id] }).first.destroy!
      end
    end
  end

  def load_section(tmpCourse, section_xml, xmlSections, errSections)
    tmpSection             = Section.new({course_id: tmpCourse.id})
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
    end
    tmpSection.instructors.delete('Staff')
    tmpSection.instructors.uniq!
    xmlSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: tmpCourse.id }
    # Update or create
    fndSection = Section.where(name: tmpSection.name, crn: tmpSection.crn, course_id: tmpSection.course_id).first
    # We want to skip this if we don't have a full match, it'll be created later
    return if Section.where(name: tmpSection.name, course_id: tmpSection.course_id).first and fndSection.nil?
    # puts '============================'
    # ap Section.where(name: tmpSection.name, course_id: tmpSection.course_id).first
    # puts '++++++++++++++'
    # ap tmpSection
    # puts '============================'
    if fndSection
      unless (fndSection.update(tmpSection.attributes.except('id', 'created_at', 'updated_at')) if fndSection.diff(tmpSection))
        errSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: tmpCourse.id }
      end
    else
      unless tmpSection.save
        errSections << { name: tmpSection.name, crn: tmpSection.crn, course_id: tmpCourse.id }
      end
    end
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
