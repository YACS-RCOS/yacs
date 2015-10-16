FactoryGirl.define do
  factory :course do
    name          'test course'
    number        1000
    min_credits   4
    max_credits   4
    department    
    # association :department, factory: :department, strategy: :create
  end
end