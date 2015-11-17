FactoryGirl.define do
  factory :school do
    sequence(:name) { |n| "School of Thing ##{n}" }
  end

  factory :department do
    sequence(:code) { |n| "DEPT#{n}" }
    sequence(:name) { |n| "Department #{n}" }
  end

  factory :course do
    sequence(:name)   { |n| "Course #{n}" }
    sequence(:number) { |n| 1000 + n }
    min_credits   4
    max_credits   4
    department
    factory :course_with_sections_with_periods do
      transient do
        sections_count 5
      end
      after(:create) do |course, evaluator|
        create_list(:section_with_periods, evaluator.sections_count, course: course)
      end
    end
  end

  factory :professor do
    name 'John Doe'
  end

  factory :semester do
    season 'Fall 2015'
  end

  factory :period do
    time '4PM-6PM Tuesday'
    period_type 'Lecture'
    location 'DCC 318'
    section
  end

  factory :periods_professor do
    period
    professor
  end

  factory :section do
    sequence(:name) { |n| "#{n}" }
    sequence(:crn)  { |n| 87600 + n }
    seats       10
    seats_taken 5
    course
    factory :section_with_periods do
      transient do
        periods_count 5
      end
      after(:create) do |section, evaluator|
        create_list(:period, evaluator.periods_count, section: section)
      end
    end
  end
end
