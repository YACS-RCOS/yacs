require "rails_helper"

RSpec.describe Department do
  before do
    @csci_dept = FactoryGirl.create(:csci_department)
    @math_dept = FactoryGirl.create(:math_department)
  end

  it 'finds department by code' do
    result = Department.where(code: 'CSCI')
    expect(result).to eq [@csci_dept]
  end

  it 'finds department by name' do
    result = Department.where(name: 'Math')
    expect(result).to eq [@math_dept]
  end
end