FactoryGirl.define do
  factory :department do
    code 'TEST'
    name 'Test Department'
  end
  factory :csci_department, class: Department do
    code 'CSCI'
    name 'Computer Science'
  end
  factory :math_department, class: Department do
    code 'MATH'
    name 'Math'
  end


  factory :course do
    name          'test course'
    number        1000
    min_credits   4
    max_credits   4
    department    
  end


  factory :professor do
    name 'John Doe'
  end


  factory :semester do
    season 'Fall 2015'
  end

  factory :semester_course do
    semester
    course
  end
end