require "rails_helper"

RSpec.describe Department do
  context 'there is a department' do
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
      expect(build(:department)).to_not be_valid
      expect(build(:department, code: @dept.code)).to_not be_valid
      expect(build(:department, name: @dept.name)).to_not be_valid
    end
  end

  it 'invalidates blank departments' do
    expect(build(:department, code: '')).to_not be_valid
    expect(build(:department, name: '')).to_not be_valid
  end
end