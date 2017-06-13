require "rails_helper"

RSpec.describe Course do
  context 'there is a course' do
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

  context 'when course is created and destroyed' do
    before do
      allow(EventSender).to receive(:send_event)
      @course = create(:course)
      @course.destroy
    end

    it 'sends a courseadded event' do
      expect(EventSender).to have_received(:send_event).with(anything, "courseadded")
    end

    it 'sends a courseremoved event' do
      expect(EventSender).to have_received(:send_event).with(anything, "courseremoved")
    end
  end
end

=begin
  context 'search' do
    context 'there are courses' do
      before do 
        name_tokens = %w{a b c d}
        names = []
        name_tokens.each do |n|
          name_tokens.each do |m|
            names << "#{n} #{m}" unless m == n
          end
        end
        numbers = [1..names.count]
        depts = FactoryGirl.create_list(:department, numbers.count)
        instructors = %w{a b c d e f g h}.map { |i| [i] }
        depts.each_with_index do |dept, i|
          names.each_with_index do |name, j|
            course = FactoryGirl.create(:course, name: name, department: dept, number: numbers[j])
            instructors.each do |instructor|
              FactoryGirl.create(:section, course: course, instructors: instructors[i])
            end
          end
        end
      end

      context 'courses without instructors'
        it 'finds courses by part of name in the correct order' do
          name_tokens.each do |n|
          end
        end
      end
    end
  end
=end
