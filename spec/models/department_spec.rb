require "rails_helper"

RSpec.describe Department do
  context 'when there is a department' do
    before do
      @dept = create(:department)
    end

    it 'finds department by code' do
      expect(@dept).to eq Department.find_by_code(@dept.code)
    end

    it 'finds department by name' do
      expect(@dept).to eq Department.find_by_name(@dept.name)
    end

    it 'invalidates duplicate departments' do
      expect(build(:department, code: @dept.code, name: @dept.name)).to_not be_valid
      expect(build(:department, code: @dept.code)).to_not be_valid
      expect(build(:department, name: @dept.name)).to_not be_valid
    end

    context 'there is a course' do
      before do
        @course = create(:course, department: @dept)
      end

      it 'has the course' do
        expect([@course]).to eq @dept.courses.where(number: @course.number)
      end
    end
  end

  it 'invalidates blank departments' do
    expect(build(:department, code: '')).to_not be_valid
    expect(build(:department, name: '')).to_not be_valid
  end
end