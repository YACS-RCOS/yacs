def json_validate_courses(courses=@courses, sections=false, periods=false)
  courses.each_with_index do |course, n|
    ['id', 'name', 'number', 'min_credits', 'max_credits', 'description', 'department_id'].each do |field|
      expect(json['courses'][n][field]) .to eq course.attributes[field]
    end
    if sections
      course.sections.each_with_index do |section, m|
        expect(json['courses'][n]['sections'][m]['id']) .to eq section.id
        if periods
          expect(json['courses'][n]['sections'][m]['periods'].length) .to eq section.num_periods
        else
          expect(json['courses'][n]['sections'][m]['periods']) .to be_nil
        end
      end
    else
      expect(json['courses'][n]['sections']) .to be_nil
    end
  end
end

describe 'Courses API' do
  context "there are departments with courses with sections" do
    before do
      courses = FactoryGirl.create_list(:course, 5)
      sections = courses.map do |course|
        FactoryGirl.create_list(:section, 5, course: course)
      end.flatten
      departments = FactoryGirl.create_list(:department, 2)
      courses[0..1].each { |c| c.update_attributes!(department_id: departments[0].id) }
      courses[2..4].each { |c| c.update_attributes!(department_id: departments[1].id) }
    end
    it '#index.json' do
      get "/api/v5/courses.json"
      json_validate_courses(Course.all)
    end

    it '#index.json?id=<:id>' do
      department = Course.first
      get "/api/v5/courses.json?id=#{department.id}"
      json_validate_courses([department])
    end

    it '#index.json?id=<:id>,<:id>' do
      courses = Course.limit(2)
      get "/api/v5/courses.json?id=#{courses[0].id},#{courses[1].id}"
      json_validate_courses(courses)
    end

    it '#index.json?department_id=<:id>' do
      department = Department.first
      get "/api/v5/courses.json?department_id=#{department.id}"
      json_validate_courses(department.courses)
    end

    it '#index.json?department_id=<:id>,<:id>' do
      departments = Department.limit(2)
      get "/api/v5/courses.json?department_id=#{departments[0].id},#{departments[1].id}"
      json_validate_courses(departments[0].courses + departments[1].courses)
    end

    it '#index.json?show_sections' do
      get "/api/v5/courses.json?show_sections"
      json_validate_courses(Course.all, true)
    end

    it '#index.json?show_sections&show_periods' do
      get "/api/v5/courses.json?show_sections&show_periods"
      json_validate_courses(Course.all, true, true)
    end
  end
end
