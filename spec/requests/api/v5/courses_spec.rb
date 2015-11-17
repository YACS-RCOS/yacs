def match_courses(courses, dept)
  courses.each_with_index do |course, n|
    expect(json['courses'][n]['id'])     .to eq course.id
    expect(json['courses'][n]['number']) .to eq course.number
    expect(json['courses'][n]['name'])   .to eq course.name
    expect(json['courses'][n]['department']['id'])   .to eq dept.id
    expect(json['courses'][n]['department']['code']) .to eq dept.code
  end
end

describe 'Courses API' do
  context 'when there is a department' do
    before do
      @depts = FactoryGirl.create_list(:department, 3)
    end

    it '#index' do
      FactoryGirl.create_list(:course, 10, department: @depts[0])
      get '/api/v5/courses.json'
      expect(response)    .to be_success
      expect(json['courses'].length) .to eq 10
      match_courses(Course.all, @depts[0])
    end

    context '#index?department_id=' do
      before do
        @courses1 = FactoryGirl.create_list(:course, 5, department: @depts[0])
        @courses2 = FactoryGirl.create_list(:course, 5, department: @depts[1])
      end

      it 'returns no courses' do
        get "/api/v5/courses.json?department_id=#{@depts[2].id}" #@depts[2] should have no courses
        expect(response).to be_success
        expect(json['courses'])    .to be_empty
      end

      it "returns the correct courses" do
        get "/api/v5/courses.json?department_id=#{@depts[0].id}" #@depts[0,1] should have 5 courses each
        expect(response)    .to be_success
        expect(json['courses'].length) .to eq 5
        match_courses(@courses1, @depts[0])

        get "/api/v5/courses.json?department_id=#{@depts[1].id}" #@depts[0,1] should have 5 courses each
        expect(response)    .to be_success
        expect(json['courses'].length) .to eq 5
        match_courses(@courses2, @depts[1])
      end
    end

    it '#show' do
      course = FactoryGirl.create(:course)
      get "/api/v5/courses/#{course.id}.json"
      expect(response).to be_success
      expect(json['id'])    .to eq course.id
      expect(json['number']).to eq course.number
      expect(json['name'])  .to eq course.name
    end
  end
end