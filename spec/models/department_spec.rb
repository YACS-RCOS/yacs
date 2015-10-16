require "rails_helper"

RSpec.describe Department do


  context 'when there are valid departments' do
    before do
      @csci_dept = create(:csci_department)
      @math_dept = create(:math_department)
    end

    it 'finds department by code' do
      result = Department.where(code: 'CSCI')
      expect(result).to eq [@csci_dept]
    end

    it 'finds department by name' do
      result = Department.where(name: 'Math')
      expect(result).to eq [@math_dept]
    end

    it 'invalidates duplicate departments' do
      expect(build(:department, code: 'CSCI')).to_not be_valid
      expect(build(:department, name: 'Computer Science')).to_not be_valid

    end

    it 'invalidates blank departments' do
      expect(build(:department, code: '')).to_not be_valid
      expect(build(:department, name: '')).to_not be_valid
    end
  end
end