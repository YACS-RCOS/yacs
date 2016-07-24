def json_validate_departments(departments=@departments, courses=false)
  departments.each_with_index do |department, n|
    ['id', 'name', 'code', 'school_id'].each do |field|
      expect(json['departments'][n][field]) .to eq department.attributes[field]
    end
    if courses
      department.courses.each_with_index do |course, m|
        expect(json['departments'][n]['courses'][m]['id']) .to eq course.id
      end
    else
      expect(json['departments'][n]['courses']) .to be_nil
    end
  end
end

describe 'Departments API' do
  context "there are schools with departments with courses" do
    before do
      departments = FactoryGirl.create_list(:department, 5)
      courses = departments.map do |department|
        FactoryGirl.create_list(:course, 5, department: department)
      end.flatten
      schools = FactoryGirl.create_list(:school, 2)
      departments[0..1].each { |d| d.update_attributes!(school_id: schools[0].id) }
      departments[2..4].each { |d| d.update_attributes!(school_id: schools[1].id) }
    end

    it '#index.json' do
      get "/api/v5/departments.json"
      json_validate_departments(Department.all)
    end

    it '#index.json?id=<:id>' do
      department = Department.first
      get "/api/v5/departments.json?id=#{department.id}"
      json_validate_departments([department])
    end

    it '#index.json?id=<:id>,<:id>' do
      departments = Department.limit(2)
      get "/api/v5/departments.json?id=#{departments[0].id},#{departments[1].id}"
      json_validate_departments(departments)
    end

    it '#index.json?school_id=<:id>' do
      school = School.first
      get "/api/v5/departments.json?school_id=#{school.id}"
      json_validate_departments(school.departments)
    end

    it '#index.json?school_id=<:id>,<:id>' do
      schools = School.limit(2)
      get "/api/v5/departments.json?school_id=#{schools[0].id},#{schools[1].id}"
      json_validate_departments(schools[0].departments + schools[1].departments)
    end

    it '#index.json?show_courses' do
      get "/api/v5/departments.json?show_courses"
      json_validate_departments(Department.all, true)
    end
  end
end
