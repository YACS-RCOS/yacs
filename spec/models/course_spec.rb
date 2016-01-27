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
  context 'search' do
    context 'there are courses' do
      before do 
        names = []
        %w{a b c d}.each do |n|
          names.each do |m|
            names << "#{n} #{m}" unless m == n
          end
        end
        numbers = %w{1 2 3 4}
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
      it 'finds courses by name in the correct order' do
        
      end
    end
  end
end
