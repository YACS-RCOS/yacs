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
