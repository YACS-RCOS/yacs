require 'rails_helper'

RSpec.describe CourseResource, type: :resource do
  describe 'serialization' do
    let!(:course) { create(:course) }

    it 'works' do
      render
      data = jsonapi_data[0]
      expect(data.id).to eq(course.id)
      expect(data.jsonapi_type).to eq('courses')
    end
  end

  describe 'filtering' do
    let!(:course1) { create(:course) }
    let!(:course2) { create(:course) }

    context 'by id' do
      before do
        params[:filter] = { id: { eq: course2.id } }
      end

      it 'works' do
        render
        expect(d.map(&:id)).to eq([course2.id])
      end
    end
  end

  describe 'sorting' do
    describe 'by id' do
      let!(:course1) { create(:course) }
      let!(:course2) { create(:course) }

      context 'when ascending' do
        before do
          params[:sort] = 'id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            course1.id,
            course2.id
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
            course2.id,
            course1.id
          ])
        end
      end
    end
  end

  describe 'sideloading' do
    # ... your tests ...
  end
end
