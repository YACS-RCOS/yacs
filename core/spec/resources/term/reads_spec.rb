require 'rails_helper'

RSpec.describe TermResource, type: :resource do
  describe 'serialization' do
    let!(:term) { create(:term) }

    it 'works' do
      render
      data = jsonapi_data[0]
      expect(data.id).to eq(term.id)
      expect(data.jsonapi_type).to eq('terms')
    end
  end

  describe 'filtering' do
    let!(:term1) { create(:term) }
    let!(:term2) { create(:term) }

    context 'by id' do
      before do
        params[:filter] = { id: { eq: term2.id } }
      end

      it 'works' do
        render
        expect(d.map(&:id)).to eq([term2.id])
      end
    end
  end

  describe 'sorting' do
    describe 'by id' do
      let!(:term1) { create(:term) }
      let!(:term2) { create(:term) }

      context 'when ascending' do
        before do
          params[:sort] = 'id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            term1.id,
            term2.id
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
            term2.id,
            term1.id
          ])
        end
      end
    end
  end

  describe 'sideloading' do
    # ... your tests ...
  end
end
