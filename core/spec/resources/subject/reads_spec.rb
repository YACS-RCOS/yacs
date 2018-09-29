require 'rails_helper'

RSpec.describe SubjectResource, type: :resource do
  describe 'serialization' do
    let!(:subject) { create(:subject) }

    it 'works' do
      render
      data = jsonapi_data[0]
      expect(data.id).to eq(subject.id)
      expect(data.jsonapi_type).to eq('subjects')
    end
  end

  describe 'filtering' do
    let!(:subject1) { create(:subject) }
    let!(:subject2) { create(:subject) }

    context 'by id' do
      before do
        params[:filter] = { id: { eq: subject2.id } }
      end

      it 'works' do
        render
        expect(d.map(&:id)).to eq([subject2.id])
      end
    end
  end

  describe 'sorting' do
    describe 'by id' do
      let!(:subject1) { create(:subject) }
      let!(:subject2) { create(:subject) }

      context 'when ascending' do
        before do
          params[:sort] = 'id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            subject1.id,
            subject2.id
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
            subject2.id,
            subject1.id
          ])
        end
      end
    end
  end

  describe 'sideloading' do
    # ... your tests ...
  end
end
