def match_sections(sections, course)
  sections.each_with_index do |section, n|
    expect(json['course_sections'][n]['id'])          .to eq section.id
    expect(json['course_sections'][n]['crn'])         .to eq section.crn
    expect(json['course_sections'][n]['name'])        .to eq section.name
    expect(json['course_sections'][n]['seats'])       .to eq section.seats
    expect(json['course_sections'][n]['seats_taken']) .to eq section.seats_taken
    expect(json['course_sections'][n]['course_id'])   .to eq course.id
    section.periods.each_with_index do |period, n|
      expect(json['course_sections'][n]['period']['id']).to eq period.id
    end
  end
end

describe 'Sections API' do
  context 'when there is a course' do
    before do
      @courses = FactoryGirl.create_list(:course, 3)
    end

    it '#index' do
      FactoryGirl.create_list(:section, 10, course: @courses[0])
      get '/api/v5/sections.json'
      expect(response)    .to be_success
      expect(json['course_sections'].length) .to eq 10
      match_sections(Section.all, @courses[0])
    end

    context '#index?course_id=' do
      before do
        @sections1 = FactoryGirl.create_list(:section, 5, course: @courses[0])
        @sections2 = FactoryGirl.create_list(:section, 5, course: @courses[1])
      end

      it 'returns no sections' do
        get "/api/v5/sections.json?course_id=#{@courses[2].id}" #@courses[2] should have no sections
        expect(response).to be_success
        expect(json['course_sections'])    .to be_empty
      end

      it "returns the correct sections" do
        get "/api/v5/sections.json?course_id=#{@courses[0].id}" #@courses[0,1] should have 5 sections each
        expect(response)    .to be_success
        expect(json['course_sections'].length) .to eq 5
        match_sections(@sections1, @courses[0])

        get "/api/v5/sections.json?course_id=#{@courses[1].id}" #@courses[0,1] should have 5 sections each
        expect(response)    .to be_success
        expect(json['course_sections'].length) .to eq 5
        match_sections(@sections2, @courses[1])
      end
    end

    it '#show' do
      section = FactoryGirl.create(:section)
      get "/api/v5/sections/#{section.id}.json"
      expect(response).to be_success
      expect(json['id'])    .to eq section.id
      expect(json['name'])  .to eq section.name
    end
  end
end