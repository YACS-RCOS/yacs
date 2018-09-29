describe "Schedules API" do
  context "enough courses are chosen" do
    before do
      FactoryGirl.create_list(:course_with_sections_with_periods, 4)
      @courses = Course.all
      @sections = @courses.map { |course| course.sections }.flatten
    end

    it "schedules have one section of each course" do
      get '/api/v5/schedules.json', { section_ids: @sections.map { |s| s.id }.join(',') }
      expect(response) .to be_success
      schedules = []
      json['schedules'].each do |j_schedule|
        courses = []
        sections = []
        j_schedule['sections'].each do |j_section|
          sections << Section.find(j_section['id'])
          courses << sections.last.course
        end
        expect(courses) .to eq @courses
        expect(Scheduler.schedule_valid?(sections)) .to be true
        schedules << sections.sort
      end
      expect(schedules.uniq) .to eq schedules
    end
  end

  context "too many courses are chosen" do
    before do
      FactoryGirl.create_list(:course_with_sections_with_periods, 7)
      @courses = Course.all
      @sections = @courses.map { |course| course.sections }.flatten
    end

    it "finds no schedules" do
      get '/api/v5/schedules.json', { section_ids: @sections.map { |s| s.id }.join(',') }
      expect(response) .to be_success
      expect(json['schedules']) .to be_empty
    end
  end

  context "no courses are chosen" do
    it "finds no schedules" do
      get '/api/v5/schedules.json'
      expect(response) .to be_success
      expect(json['schedules']) .to be_empty
    end
  end
end
