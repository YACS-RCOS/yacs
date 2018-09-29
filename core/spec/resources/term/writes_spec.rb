require 'rails_helper'

RSpec.describe TermResource, type: :resource do
  describe 'creating' do
    let(:payload) do
      {
        data: {
          type: 'terms',
          attributes: { }
        }
      }
    end

    let(:instance) do
      TermResource.build(payload)
    end

    it 'works' do
      expect {
        expect(instance.save).to eq(true)
      }.to change { Term.count }.by(1)
    end
  end

  describe 'updating' do
    let!(:term) { create(:term) }

    let(:payload) do
      {
        data: {
          id: term.id.to_s,
          type: 'terms',
          attributes: { } # Todo!
        }
      }
    end

    let(:instance) do
      TermResource.find(payload)
    end

    xit 'works (add some attributes and enable this spec)' do
      expect {
        expect(instance.update_attributes).to eq(true)
      }.to change { term.reload.updated_at }
      # .and change { term.foo }.to('bar') <- example
    end
  end

  describe 'destroying' do
    let!(:term) { create(:term) }

    let(:instance) do
      TermResource.find(id: term.id)
    end

    it 'works' do
      expect {
        expect(instance.destroy).to eq(true)
      }.to change { Term.count }.by(-1)
    end
  end
end
