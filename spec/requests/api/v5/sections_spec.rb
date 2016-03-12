def match_sections(sections, course)
  sections.each_with_index do |section, n|
    expect(xml.sections.section[n].search('section-id').text)          .to eq section.id.to_s
    expect(xml.sections.section[n].search('section-crn').text)         .to eq section.crn.to_s
    expect(xml.sections.section[n].search('section-name').text)        .to eq section.name.to_s
    expect(xml.sections.section[n].search('section-seats').text)       .to eq section.seats.to_s
    expect(xml.sections.section[n].search('section-seats-taken').text) .to eq section.seats_taken.to_s
    expect(xml.sections.section[n].search('course-id').text)           .to eq course.id.to_s
    # section.periods.each_with_index do |period, nn|
    #   expect(xml.sections.section[n].periods.period[nn].search('period-day').text) .to eq period.day
    # end
  end
end

def json_validate_sections(sections=@sections, periods=false)
  sections.each_with_index do |section, n|
    ['id', 'name', 'instructors', 'crn', 'seats', 'seats_taken', 'num_periods'].each do |field|
      expect(json['sections'][n][field]) .to eq section.attributes[field]
    end
    if periods
      section.periods_type.each_with_index do |periods_type, m|
        expect(json['sections'][n]['periods'][m]['type']) .to eq section.periods_type[m]
        expect(json['sections'][n]['periods'][m]['day']) .to eq section.periods_day[m]
        expect(json['sections'][n]['periods'][m]['start']) .to eq section.periods_start[m]
        expect(json['sections'][n]['periods'][m]['end']) .to eq section.periods_end[m]
      end
    else
      expect(json['sections'][n]['periods']) .to be_nil
    end
  end
end

describe 'Sections API' do
  context 'when there is a course' do
    before do
      @courses = FactoryGirl.create_list(:course, 3)
    end

    it '#index' do
      sections = FactoryGirl.create_list(:section, 10, course: @courses[0])
      get '/api/v5/sections.xml'
      expect(response)    .to be_success
      expect(xml.sections.section.length) .to eq sections.length
      match_sections(sections, @courses[0])

      # get '/api/v5/sections.json'
      # expect(response) .to be_success
      # expect(json['sections'].length) .to eq sections.length
      # json_match_sections(sections)
    end

    context '#index?course_id=' do
      before do
        @sections1 = FactoryGirl.create_list(:section, 5, course: @courses[0])
        @sections2 = FactoryGirl.create_list(:section, 5, course: @courses[1])
      end

      it 'returns no sections' do
        get "/api/v5/sections.xml?course_id=#{@courses[2].id}" #@courses[2] should have no sections
        expect(response).to be_success
        expect(xml.sections.try(:section))    .to be_nil

        # get "/api/v5/sections.json?course_id=#{@courses[2].id}" #@courses[2] should have no sections
        # expect(response).to be_success
        # expect(json['sections'].length) .to eq 0
      end

      it "returns the correct sections" do
        get "/api/v5/sections.xml?course_id=#{@courses[0].id}" #@courses[0,1] should have 5 sections each
        expect(response)    .to be_success
        expect(xml.sections.section.length) .to eq 5
        match_sections(@sections1, @courses[0])
        get "/api/v5/sections.xml?course_id=#{@courses[1].id}" #@courses[0,1] should have 5 sections each
        expect(response)    .to be_success
        expect(xml.sections.section.length) .to eq 5
        match_sections(@sections2, @courses[1])

        # get "/api/v5/sections.json?course_id=#{@courses[0].id}" #@courses[0,1] should have 5 sections each
        # expect(response)    .to be_success
        # expect(json['sections'].length) .to eq 5
        # json_match_sections(@sections1)
        # get "/api/v5/sections.json?course_id=#{@courses[1].id}" #@courses[0,1] should have 5 sections each
        # expect(response)    .to be_success
        # expect(json['sections'].length) .to eq 5
        # json_match_sections(@sections2)
      end
    end

    # it '#show' do
    #   section = FactoryGirl.create(:section)
    #   get "/api/v5/sections/#{section.id}.xml"
    #   expect(response).to be_success
    #   expect(xml.search('section-id').text) .to eq section.id.to_s
    #   expect(xml.search('section-crn').text) .to eq section.crn.to_s
    # end
  end

  context "there are courses with sections with periods" do
    before do
      FactoryGirl.create_list(:course_with_sections_with_periods, 4)
    end

    it '#index.json' do
      get "/api/v5/sections.json"
      json_validate_sections(Section.all)
    end

    it '#index.json?id=<:id>' do
      department = Section.first
      get "/api/v5/sections.json?id=#{department.id}"
      json_validate_sections([department])
    end

    it '#index.json?id=<:id>,<:id>' do
      sections = Section.limit(2)
      get "/api/v5/sections.json?id=#{sections[0].id},#{sections[1].id}"
      json_validate_sections(sections)
    end

    it '#index.json?course_id=<:id>' do
      course = Course.first
      get "/api/v5/sections.json?course_id=#{course.id}"
      json_validate_sections(course.sections)
    end

    it '#index.json?course_id=<:id>,<:id>' do
      courses = Course.limit(2)
      get "/api/v5/sections.json?course_id=#{courses[0].id},#{courses[1].id}"
      json_validate_sections(courses[0].sections + courses[1].sections)
    end

    it '#index.json?show_periods' do
      get "/api/v5/sections.json?show_periods"
      json_validate_sections(Section.all, true)
    end
  end
end