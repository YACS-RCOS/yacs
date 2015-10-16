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
end