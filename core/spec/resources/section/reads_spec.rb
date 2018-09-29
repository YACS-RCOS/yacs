require 'rails_helper'

RSpec.describe SectionResource, type: :resource do
  describe 'serialization' do
    let!(:section) { create(:section) }

    it 'works' do
      render
      data = jsonapi_data[0]
      expect(data.id).to eq(section.id)
      expect(data.jsonapi_type).to eq('sections')
    end
  end

  describe 'filtering' do
    let!(:section1) { create(:section) }
    let!(:section2) { create(:section) }

    context 'by id' do
      before do
        params[:filter] = { id: { eq: section2.id } }
      end

      it 'works' do
        render
        expect(d.map(&:id)).to eq([section2.id])
      end
    end
  end

  describe 'sorting' do
    describe 'by id' do
      let!(:section1) { create(:section) }
      let!(:section2) { create(:section) }

      context 'when ascending' do
        before do
          params[:sort] = 'id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            section1.id,
            section2.id
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
            section2.id,
            section1.id
          ])
        end
      end
    end
  end

  describe 'sideloading' do
    # ... your tests ...
  end
end
