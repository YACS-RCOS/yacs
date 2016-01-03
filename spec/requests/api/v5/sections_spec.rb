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

describe 'Sections API' do
  context 'when there is a course' do
    before do
      @courses = FactoryGirl.create_list(:course, 3)
    end

    it '#index' do
      FactoryGirl.create_list(:section, 10, course: @courses[0])
      get '/api/v5/sections.xml'
      expect(response)    .to be_success
      expect(xml.sections.section.length) .to eq 10
      match_sections(Section.all, @courses[0])
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
      end
    end

    it '#show' do
      section = FactoryGirl.create(:section)
      get "/api/v5/sections/#{section.id}.xml"
      expect(response).to be_success
      expect(xml.search('section-id').text)    .to eq section.id.to_s
      expect(xml.search('section-crn').text)  .to eq section.crn.to_s
    end
  end
end