require "rails_helper"

RSpec.describe Course do
  context 'there is a course'
    before do
      @course = FactoryGirl.create(:course)
    end

    it 'finds course by department' do
      dept = Department.find_by_code(@course.code)
      expect(dept.courses.where(number: @course.number)).to eq [@test_course]
    end

    context 'when there is a semester_course' do
      before do
        @semester_course = FactoryGirl.create(:semester_course)
      end

      it 'finds a course by section' do

      end
    end

end
