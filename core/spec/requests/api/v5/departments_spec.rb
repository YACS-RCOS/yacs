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
      schools = FactoryGirl.create_list(:school, 2)
      departments = FactoryGirl.create_list(:department, 2, school: schools[0])
      departments.concat FactoryGirl.create_list(:department, 3, school: schools[1])
      courses = departments.map do |department|
        FactoryGirl.create_list(:course, 5, department: department)
      end.flatten
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

  context 'There is a department to be created' do
    it 'creates a department' do
      school = FactoryGirl.create(:school)
      department_params = {
        department: {
          name: 'Information Technology and Web Science',
          code: 'ITWS',
          school_id: school.id
        }
      }
      post "/api/v5/departments/", department_params
      expect(response).to be_success
      created_department = Department.find_by(code: 'ITWS')
      expect(created_department).to be_present
      json_validate_departments([created_department])
    end
  end

  context 'There is a department to be updated' do
    it 'updates the code for department' do
      department = FactoryGirl.create(:department, code: 'XYZ')
      department_params = { department: { code: 'other' } }
      put "/api/v5/departments/#{department.id}", department_params
      department.reload
      expect(department.code).to eq 'other'
      json_validate_departments([department])
    end

    it 'updates the name for department' do
      department_params = { department: { name: 'other' } }
      department = FactoryGirl.create(:department, name: 'ITWS')
      put "/api/v5/departments/#{department.id}", department_params
      department.reload
      expect(department.name).to eq 'other'    
      json_validate_departments([department])
    end

    it 'deletes a department' do
      department = FactoryGirl.create(:department, name: 'ITWS')
      delete "/api/v5/departments/#{department.id}"
      expect(response.status).to eq 204
    end

    it 'department id is not found for deletion' do
      department = FactoryGirl.create(:department, name: 'ITWS')
      delete "/api/v5/departments/#{500000}"
      expect(response.status).to eq 404
    end
  end
end
