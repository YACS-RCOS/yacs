FactoryBot.define do
  factory :school do
    uuid { SecureRandom.uuid }
    sequence(:longname) { |n| "School of Thing ##{n}" }
  end

  factory :department do
    uuid { SecureRandom.uuid }
    sequence(:shortname) { |n| "DEPT#{n}" }
    sequence(:longname) { |n| "Department #{n}" }
    school
  end

  factory :course do
    uuid { SecureRandom.uuid }
    sequence(:name)   { |n| "Course #{n}" }
    sequence(:number) { |n| 1000 + n }
    min_credits { 4 }
    max_credits { 4 }
    department
    factory :course_with_sections_with_periods do
      transient do
        sections_count { 6 }
      end
      after(:create) do |course, evaluator|
        create_list(:section_with_periods, evaluator.sections_count, course: course)
      end
    end
  end


=begin
[0, 2, 4]
[1000, 1400, 1000]
[1050, 1450, 1050]

[0, 2, 4]
[0900, 1500, 1100]
[0950, 1550, 1150]

[1, 3]
[1000, 1000]
[1150, 1150]

[1, 3]
[1400, 0900]
[1550, 1050]

[0, 2]
[1300, 1000]
[1450, 1150]

[0, 2]
[1500, 0800]
[1650, 0950]

In this test data, each course effectively has the same set of (N=6) sections,
on the same days and times of every other course. Because of this, if N courses
or fewer are selected, then (assuming every section from each course is selected),
then the number of possible schedules should be non-zero and predictable.
Conversely, if greater than N courses are chosen the number of possible schedules
should be zero.

=end

  factory :section do
    uuid { SecureRandom.uuid }
    sequence(:name) { |n| "#{n}" }
    sequence(:crn)  { |n| 87600 + n }
    seats       { 10 }
    seats_taken { 5 }
    course
    instructors { ['Some Prof', 'Other Prof'] }
    factory :section_with_periods do
      sequence(:num_periods) do |n|
        num_p = [3, 3, 2, 2, 2, 2]
        num_p[n % 6]
      end
      sequence(:periods_day) do |n| 
        p_day = [[0, 2, 4], [0, 2, 4], [1, 3], [1, 3], [0, 2], [0, 2]]
        p_day[n % 6]
      end
      sequence(:periods_start) do |n|
        p_start = [[1000, 1400, 1000], [900, 1500, 1100], [1000, 1000], [1400, 800], [1300, 1000], [1500, 800]]
        p_start[n % 6]
      end
      sequence(:periods_end) do |n|
        p_end = [[1050, 1450, 1050], [950, 1550, 1150], [1150, 1150], [1550, 950], [1450, 1150], [1650, 950]]
        p_end[n % 6]
      end
      sequence(:periods_type) do |n|
        num_p = [3, 3, 2, 2, 2, 2]
        types = []
        num_p[n % 6].times { types << 'LEC' }
        types
      end
    end
  end
end
