require 'rails_helper'

RSpec.describe "sections#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/sections/#{section.id}", payload
  end

  describe 'basic update' do
    let!(:section) { create(:section) }

    let(:payload) do
      {
        data: {
          id: section.id.to_s,
          type: 'sections',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect(SectionResource).to receive(:find).and_call_original
      expect {
        make_request
      }.to change { section.reload.attributes }
      expect(response.status).to eq(200)
    end
  end
end
