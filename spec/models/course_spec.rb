require "rails_helper"

RSpec.describe Course do

  before do
    @test_course = FactoryGirl.create(:course)
  end

  it 'finds course by department' do
    dept = Department.find_by_code('TEST')
    result = dept.courses.where(number: 1000)
    expect(result).to eq [@test_course]
  end

end
