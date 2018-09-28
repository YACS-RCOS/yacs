require 'rails_helper'

RSpec.describe SchoolResource, type: :resource do
  describe 'serialization' do
    let!(:school) { create(:school) }

    it 'works' do
      render
      data = jsonapi_data[0]
      expect(data.id).to eq(school.id)
      expect(data.jsonapi_type).to eq('schools')
    end
  end

  describe 'filtering' do
    let!(:school1) { create(:school) }
    let!(:school2) { create(:school) }

    context 'by id' do
      before do
        params[:filter] = { id: { eq: school2.id } }
      end

      it 'works' do
        render
        expect(d.map(&:id)).to eq([school2.id])
      end
    end
  end

  describe 'sorting' do
    describe 'by id' do
      let!(:school1) { create(:school) }
      let!(:school2) { create(:school) }

      context 'when ascending' do
        before do
          params[:sort] = 'id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            school1.id,
            school2.id
          ])
        end
      end

      context 'when descending' do
        before do
          params[:sort] = '-id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            school2.id,
            school1.id
          ])
        end
      end
    end
  end

  describe 'sideloading' do
    # ... your tests ...
  end
end
