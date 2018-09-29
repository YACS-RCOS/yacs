require 'rails_helper'

RSpec.describe "listings#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/listings/#{listing.id}", params: params
  end

  describe 'basic fetch' do
    let!(:listing) { create(:listing) }

    it 'works' do
      expect(ListingResource).to receive(:find).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.jsonapi_type).to eq('listings')
      expect(d.id).to eq(listing.id)
    end
  end
end
