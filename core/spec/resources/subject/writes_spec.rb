require 'rails_helper'

RSpec.describe SubjectResource, type: :resource do
  describe 'creating' do
    let(:payload) do
      {
        data: {
          type: 'subjects',
          attributes: { }
        }
      }
    end

    let(:instance) do
      SubjectResource.build(payload)
    end

    it 'works' do
      expect {
        expect(instance.save).to eq(true)
      }.to change { Subject.count }.by(1)
    end
  end

  describe 'updating' do
    let!(:subject) { create(:subject) }

    let(:payload) do
      {
        data: {
          id: subject.id.to_s,
          type: 'subjects',
          attributes: { } # Todo!
        }
      }
    end

    let(:instance) do
      SubjectResource.find(payload)
    end

    xit 'works (add some attributes and enable this spec)' do
      expect {
        expect(instance.update_attributes).to eq(true)
      }.to change { subject.reload.updated_at }
      # .and change { subject.foo }.to('bar') <- example
    end
  end

  describe 'destroying' do
    let!(:subject) { create(:subject) }

    let(:instance) do
      SubjectResource.find(id: subject.id)
    end

    it 'works' do
      expect {
        expect(instance.destroy).to eq(true)
      }.to change { Subject.count }.by(-1)
    end
  end
end
