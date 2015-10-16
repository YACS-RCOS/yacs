FactoryGirl.define do
  factory :csci_department, class: Department do
    code 'CSCI'
    name 'Computer Science'
  end
  factory :math_department, class: Department do
    code 'MATH'
    name 'Math'
  end
end