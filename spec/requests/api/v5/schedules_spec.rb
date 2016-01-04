describe "Schedules API" do
  context "when sections are chosen" do
    before do
      FactoryGirl.create_list(:course_with_sections_with_periods, 20)
      @sections = []
      @courses = []
      Course.all.each_with_index do |c, i|
        @sections += c.sections.each_with_index do |s, ii|
          if i % 4 == 0 && ii % 2 == 0
            @sections << s
            @courses << c
          end
        end
      end
      @courses.uniq!
    end

    it "schedules have one section of each course" do
      get '/api/v5/schedules.xml', { sections: @sections.map { |s| s.id }}
      binding.pry
      expect(response) .to be_success
      courses = []
      xml.schedules.schedule[0].sections.section.each do |xs|
        courses << Section.find(xs.search('section-id').text).course
      end
      expect(courses) .to eq @courses
    end
  end  
end