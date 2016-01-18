describe "Scheduler" do 
  # In order to truly test the scheduler, we must represent
  # it as a discrete mathematical problem.
  # The number of schedules generated should be equal to the
  # number of unique ordered subsets of k sections from the 
  # set of n non-conflicting sections per course. Here,
  # k represents the number of courses to schedule.
  # Therefore, the number of schedules, S, can be found by:
  #                         n!
  #                   S = ------
  #                       (n-k)!
  # for n>k>0
  # In this case, n=6 (defined by factories.rb), and we will
  # test where k = 0..7. When k=0, there are no courses selected
  # and the number of schedules generated should obviously
  # be zero. When k=n=6, there should only be n=6 schedules
  # Finally, when k>n, e.g., k=7, zero schedules should be generated.
  let(:n) { 6 }
  (0..7).each do |course_count|
    it "generates the correct number of valid schedules for #{course_count} courses of 6 sections each" do
      courses = FactoryGirl.create_list(:course_with_sections_with_periods, course_count)
      sections = courses.map { |course| course.sections }.flatten
      schedules = Scheduler.all_schedules(sections)
      s = (1..n).include?(course_count) ? factorial(6) / factorial(6 - course_count) : 0
      expect(schedules.count) .to eq s
      schedules.each do |schedule|
        expect(Scheduler.schedule_valid?(schedule)) .to eq true
      end
    end
  end
end