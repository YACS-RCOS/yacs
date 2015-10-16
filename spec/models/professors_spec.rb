require "rails_helper"

RSpec.describe Professor do
  before do
    @name = FactoryGirl.create(:professor)
    @name2 = create(:professor, name: 'Johnson Smith')
    @name3 = create(:professor, name: 'Jane Smith')
    @name4 = create(:professor, name: 'Smithy Jacobs')
  end

  it 'finds professor by full name' do
    result = Professor.where(name: 'John Doe')
    expect(result).to eq [@name]
  end

  it 'finds professor by substring from first name' do
    result = Professor.where('name LIKE ?', 'John%' )
    expect(result).to eq [@name,@name2]
  end

  it 'finds professor by substring from first character of name' do
    result = Professor.where('name LIKE ?', 'J%' )
    expect(result).to eq [@name,@name2,@name3]
  end

  it 'finds professor by substring' do
    result = Professor.where('name LIKE ?', '%Smith%' )
    expect(result).to eq [@name2,@name3,@name4]
  end

  it 'does not find the names' do
    result = Professor.where(name: 'Andy')
    expect(result).to be_blank
  end
end
