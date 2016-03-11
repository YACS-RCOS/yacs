def match_courses(courses, dept)
  courses.each_with_index do |course, n|
    expect(xml.courses.course[n].search('course-id').text) .to eq course.id.to_s
    expect(xml.courses.course[n].search('course-name').text) .to eq course.name.to_s
    expect(xml.courses.course[n].search('course-number').text) .to eq course.number.to_s
    expect(xml.courses.course[n].search('department-code').text) .to eq dept.code.to_s
  end
end

def json_validate_courses(courses=@courses, sections=false)
  courses.each_with_index do |course, n|
    ['id', 'name', 'number', 'min_credits', 'max_credits', 'description', 'department_id'].each do |field|
      expect(json['courses'][n][field]) .to eq course.attributes[field]
    end
    if sections
      course.sections.each_with_index do |section, m|
        expect(json['courses'][n]['sections'][m]['id']) .to eq section.id
      end
    else
      expect(json['courses'][n]['sections']) .to be_nil
    end
  end
end

describe 'Courses API' do
  context 'when there is a department' do
    before do
      @depts = FactoryGirl.create_list(:department, 3)
    end

    it '#index' do
      courses = FactoryGirl.create_list(:course, 10, department: @depts[0])
      get '/api/v5/courses.xml'
      expect(response)    .to be_success
      expect(xml.courses.course.length) .to eq courses.length
      match_courses(courses, @depts[0])

      get '/api/v5/courses.json'
      expect(response) .to be_success
      expect(json['courses'].length) .to eq courses.length
      json_match_courses(courses)
    end

    context '#index?department_id=' do
      before do
        @courses1 = FactoryGirl.create_list(:course, 5, department: @depts[0])
        @courses2 = FactoryGirl.create_list(:course, 5, department: @depts[1])
      end

      it 'returns no courses' do
        get "/api/v5/courses.xml?department_id=#{@depts[2].id}" #@depts[2] should have no courses
        expect(response).to be_success
        expect(xml.courses.try(:course)) .to be_nil

        get "/api/v5/courses.json?department_id=#{@depts[2].id}"
        expect(response).to be_success
        expect(json['courses']) .to be_empty
      end

      it "returns the correct courses" do
        get "/api/v5/courses.xml?department_id=#{@depts[0].id}" #@depts[0,1] should have 5 courses each
        expect(response)    .to be_success
        expect(xml.courses.course.length) .to eq @depts[0].courses.length
        match_courses(@courses1, @depts[0])

        get "/api/v5/courses.xml?department_id=#{@depts[1].id}" #@depts[0,1] should have 5 courses each
        expect(response)    .to be_success
        expect(xml.courses.course.length) .to eq @depts[1].courses.length
        match_courses(@courses2, @depts[1])

        get "/api/v5/courses.json?department_id=#{@depts[0].id}" #@depts[0,1] should have 5 courses each
        expect(response)    .to be_success
        expect(json['courses'].length) .to eq @depts[0].courses.length
        json_match_courses(@courses1)

        get "/api/v5/courses.json?department_id=#{@depts[1].id}" #@depts[0,1] should have 5 courses each
        expect(response)    .to be_success
        expect(json['courses'].length) .to eq @depts[1].courses.length
        json_match_courses(@courses2)
      end
    end

    # it '#show' do
    #   course = FactoryGirl.create(:course)
    #   get "/api/v5/courses/#{course.id}.xml"
    #   expect(response).to be_success
    #   expect(xml.search('course-id').text)     .to eq course.id.to_s
    #   expect(xml.search('course-number').text) .to eq course.number.to_s
    #   expect(xml.search('course-name').text)   .to eq course.name.to_s
    # end
  end
end