require "rails_helper"

RSpec.describe Course do
  context 'there is a course'
    before do
      @course = create(:course)
    end

    context 'when there is a semester_course' do
      before do
        @semester_course = create(:semester_course, course: @course)
      end

      it 'has the semester_course' do
        expect(@course.semester_courses).to eq [@semester_course]
      end

      context 'when there is a section' do
        before do
          @section = create(:section, semester_course: @semester_course)
        end

        it 'has the section [semester_course]' do
          expect(@semester_course.sections).to eq [@section]
        end
      end
    end

end
