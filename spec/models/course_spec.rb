require "rails_helper"

RSpec.describe Course do
  context 'there is a course'
    before do
      @course = create(:course)
    end
    context 'when there is a section' do
      before do
        @section = create(:section, course: @course)
      end

      it 'has the section' do
        expect(@course.sections).to eq [@section]
      end
    end

end
