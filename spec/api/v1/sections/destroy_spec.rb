require 'rails_helper'

RSpec.describe "sections#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v6/sections/#{section.id}"
  end

  describe 'basic destroy' do
    let!(:section) { create(:section) }

    it 'updates the resource' do
      expect(SectionResource).to receive(:find).and_call_original
      expect { make_request }.to change { Section.count }.by(-1)
      expect { section.reload }
        .to raise_error(ActiveRecord::RecordNotFound)
      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
