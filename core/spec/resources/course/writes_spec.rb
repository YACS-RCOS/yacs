require 'rails_helper'

RSpec.describe CourseResource, type: :resource do
  describe 'creating' do
    let(:payload) do
      {
        data: {
          type: 'courses',
          attributes: { }
        }
      }
    end

    let(:instance) do
      CourseResource.build(payload)
    end

    it 'works' do
      expect {
        expect(instance.save).to eq(true)
      }.to change { Course.count }.by(1)
    end
  end

  describe 'updating' do
    let!(:course) { create(:course) }

    let(:payload) do
      {
        data: {
          id: course.id.to_s,
          type: 'courses',
          attributes: { } # Todo!
        }
      }
    end

    let(:instance) do
      CourseResource.find(payload)
    end

    xit 'works (add some attributes and enable this spec)' do
      expect {
        expect(instance.update_attributes).to eq(true)
      }.to change { course.reload.updated_at }
      # .and change { course.foo }.to('bar') <- example
    end
  end

  describe 'destroying' do
    let!(:course) { create(:course) }

    let(:instance) do
      CourseResource.find(id: course.id)
    end

    it 'works' do
      expect {
        expect(instance.destroy).to eq(true)
      }.to change { Course.count }.by(-1)
    end
  end
end
