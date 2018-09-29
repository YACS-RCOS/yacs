require 'rails_helper'

RSpec.describe ListingResource, type: :resource do
  describe 'serialization' do
    let!(:listing) { create(:listing) }

    it 'works' do
      render
      data = jsonapi_data[0]
      expect(data.id).to eq(listing.id)
      expect(data.jsonapi_type).to eq('listings')
    end
  end

  describe 'filtering' do
    let!(:listing1) { create(:listing) }
    let!(:listing2) { create(:listing) }

    context 'by id' do
      before do
        params[:filter] = { id: { eq: listing2.id } }
      end

      it 'works' do
        render
        expect(d.map(&:id)).to eq([listing2.id])
      end
    end
  end

  describe 'sorting' do
    describe 'by id' do
      let!(:listing1) { create(:listing) }
      let!(:listing2) { create(:listing) }

      context 'when ascending' do
        before do
          params[:sort] = 'id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            listing1.id,
            listing2.id
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
            listing2.id,
            listing1.id
          ])
        end
      end
    end
  end

  describe 'sideloading' do
    # ... your tests ...
  end
end
