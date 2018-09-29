require 'rails_helper'

RSpec.describe "listings#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/listings", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'listings',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'works' do
      expect(ListingResource).to receive(:build).and_call_original
      expect {
        make_request
      }.to change { Listing.count }.by(1)
      expect(response.status).to eq(201)
    end
  end
end
