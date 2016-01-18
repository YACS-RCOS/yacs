describe "Schedules API" do
  context "enough courses are chosen" do
    before do
      FactoryGirl.create_list(:course_with_sections_with_periods, 4)
      @courses = Course.all
      @sections = @courses.map { |course| course.sections }.flatten
    end

    it "[xml] schedules have one section of each course" do
      get '/api/v5/schedules.xml', { sections: @sections.map { |s| s.id }}
      expect(response) .to be_success
      xml.schedules.schedule.each do |x_schedule|
        courses = []
        sections = []
        x_schedule.sections.section.each do |x_section|
          sections << Section.find(x_section.search('section-id').text)
          courses << sections.last.course
        end
        expect(courses) .to eq @courses
        expect(Schedule::Scheduler.schedule_valid?(sections)) .to be true
      end
    end

    it "[json] schedules have one section of each course" do
      get '/api/v5/schedules.json', { sections: @sections.map { |s| s.id }}
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
        expect(Schedule::Scheduler.schedule_valid?(sections)) .to be true
        schedules << sections.sort
      end
      # binding.pry
      expect(schedules.uniq) .to eq schedules
    end
  end

  context "too many courses are chosen" do
    before do
      FactoryGirl.create_list(:course_with_sections_with_periods, 7)
      @courses = Course.all
      @sections = @courses.map { |course| course.sections }.flatten
    end

    it "[json] finds no schedules" do
      get '/api/v5/schedules.json', { sections: @sections.map { |s| s.id }}
      expect(response) .to be_success
      expect(json['schedules']) .to be_empty
    end
  end
end