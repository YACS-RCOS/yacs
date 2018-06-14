def json_validate_courses(courses=@courses, sections=false, periods=false)
  courses.each_with_index do |course, n|
    ['id', 'name', 'number', 'min_credits', 'max_credits', 'description', 'department_id', 'tags'].each do |field|
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

  context 'There is a course to be created' do
    it 'creates a course' do
      department = FactoryGirl.create(:department)
      course_params={
        course: {
          name: 'Principles of Software',
          number: 2600,
          min_credits: 1,
          max_credits: 4,
          description: 'XXXXXX',
          department_id: department.id,
          tags: []
        }
      }
      post "/api/v5/courses/", course_params
      expect(response).to be_success
      created_course=Course.find_by(name: 'Principles of Software', number: 2600)
      expect(created_course).to be_present
      json_validate_courses([created_course])
    end
  end

  context 'There is a course to be updated' do
    let(:course) { FactoryGirl.create(:course, max_credits: 4) }
    it 'updates the maximum number of credits for the course'do
      course_params={
        course: {
          max_credits: 7
        }
      }
      put "/api/v5/courses/#{course.id}", course_params
      course.reload
      expect(course.max_credits).to eq 7
      json_validate_courses([course])
    end
    it 'updates the minimum number of credits for the course' do
      course_params={
        course: {
          min_credits:2
        }
      }

      course = FactoryGirl.create(:course, min_credits: 2)
      put "/api/v5/courses/#{course.id}", course_params
      course.reload
      expect(course.min_credits).to eq 2
      json_validate_courses([course])
    end

    it 'updates the tag' do
      course_params={
        course: {
          tags: ["featured"]
        }
      }

      course = FactoryGirl.create(:course, tags: ["featured"])
      put "/api/v5/courses/#{course.id}", course_params
      course.reload
      expect(course.tags).to eq ["featured"]
      json_validate_courses([course])
    end

    it 'deletes a course' do
      course = FactoryGirl.create(:course)
      delete "/api/v5/courses/#{course.id}"
      expect(response.status).to eq 204
    end

    it 'course id is not found for deletion' do
      course = FactoryGirl.create(:course)
      delete "/api/v5/courses/#{5000000}"
      expect(response.status).to eq 404
    end

  end
end
