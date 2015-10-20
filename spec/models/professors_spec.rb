require "rails_helper"

RSpec.describe Professor do
  before do
    @professor = FactoryGirl.create(:professor)
  end

  context 'when there is a period' do
    before do
      @period = FactoryGirl.create(:period)
    end

    context 'when there are periods_professor' do
      before do
        @period_professor = FactoryGirl.create(:period_professor, period: @period)
      end

      it 'has the periods' do
        expect(@professor.periods).to eq [@period]
      end

    end

  end

  context 'when there is a professor' do
    before do
      @name1 = create(:professor, name: 'Johnson Smith')
      @name2 = create(:professor, name: 'Jane Smith')
      @name3 = create(:professor, name: 'Smithy Jacobs')
    end

    it 'finds professor by full name' do
      expect(Professor.where(name: 'John Doe')). to eq [@professor]
    end

    it 'finds professor by substring from first name' do
      expect(Professor.name_like('John%')).to eq [@professor,@name1]
    end

    it 'finds professor by substring from first character of name' do
      expect(Professor.name_like('J%')).to eq [@professor,@name1,@name2]
    end

    it 'finds professor by substring' do
      expect(Professor.name_like('%Smith%')).to eq [@name1,@name2,@name3]
    end

    it 'does not find a professor' do
      result = Professor.where(name: 'Andy')
      expect(result).to be_blank
    end

  end
end
