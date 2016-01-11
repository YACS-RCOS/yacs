describe "Schedules API" do
  context "when sections are chosen" do
    before do
      FactoryGirl.create_list(:course_with_sections_with_periods, 20)
      @sections = []
      @courses = []
      Course.all.each_with_index do |c, i|
        c.sections.each_with_index do |s, ii|
          if i % 4 == 0 
            @sections << s
            @courses << c
          end
        end
      end
      @courses.uniq!
    end

    it "schedules have one section of each course" do
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
  end  
end