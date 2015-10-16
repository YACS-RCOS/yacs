require "rails_helper"

RSpec.describe Semester do
  before do
    @season = FactoryGirl.create(:semester)
  end
  it 'finds semester by season' do
    result = Semester.where(season: 'Fall 2015')
    expect(result).to eq [@season]
  end
end
