require 'rails_helper'

RSpec.describe "listings#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/listings/#{listing.id}", payload
  end

  describe 'basic update' do
    let!(:listing) { create(:listing) }

    let(:payload) do
      {
        data: {
          id: listing.id.to_s,
          type: 'listings',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect(ListingResource).to receive(:find).and_call_original
      expect {
        make_request
      }.to change { listing.reload.attributes }
      expect(response.status).to eq(200)
    end
  end
end
