require 'rails_helper'

RSpec.describe SchoolResource, type: :resource do
  describe 'creating' do
    let(:payload) do
      {
        data: {
          type: 'schools',
          attributes: { }
        }
      }
    end

    let(:instance) do
      SchoolResource.build(payload)
    end

    it 'works' do
      expect {
        expect(instance.save).to eq(true)
      }.to change { School.count }.by(1)
    end
  end

  describe 'updating' do
    let!(:school) { create(:school) }

    let(:payload) do
      {
        data: {
          id: school.id.to_s,
          type: 'schools',
          attributes: { } # Todo!
        }
      }
    end

    let(:instance) do
      SchoolResource.find(payload)
    end

    xit 'works (add some attributes and enable this spec)' do
      expect {
        expect(instance.update_attributes).to eq(true)
      }.to change { school.reload.updated_at }
      # .and change { school.foo }.to('bar') <- example
    end
  end

  describe 'destroying' do
    let!(:school) { create(:school) }

    let(:instance) do
      SchoolResource.find(id: school.id)
    end

    it 'works' do
      expect {
        expect(instance.destroy).to eq(true)
      }.to change { School.count }.by(-1)
    end
  end
end
