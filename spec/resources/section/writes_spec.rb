require 'rails_helper'

RSpec.describe SectionResource, type: :resource do
  describe 'creating' do
    let(:payload) do
      {
        data: {
          type: 'sections',
          attributes: { }
        }
      }
    end

    let(:instance) do
      SectionResource.build(payload)
    end

    it 'works' do
      expect {
        expect(instance.save).to eq(true)
      }.to change { Section.count }.by(1)
    end
  end

  describe 'updating' do
    let!(:section) { create(:section) }

    let(:payload) do
      {
        data: {
          id: section.id.to_s,
          type: 'sections',
          attributes: { } # Todo!
        }
      }
    end

    let(:instance) do
      SectionResource.find(payload)
    end

    xit 'works (add some attributes and enable this spec)' do
      expect {
        expect(instance.update_attributes).to eq(true)
      }.to change { section.reload.updated_at }
      # .and change { section.foo }.to('bar') <- example
    end
  end

  describe 'destroying' do
    let!(:section) { create(:section) }

    let(:instance) do
      SectionResource.find(id: section.id)
    end

    it 'works' do
      expect {
        expect(instance.destroy).to eq(true)
      }.to change { Section.count }.by(-1)
    end
  end
end
