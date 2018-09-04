require 'rails_helper'

RSpec.describe "listings#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v6/listings/#{listing.id}"
  end

  describe 'basic destroy' do
    let!(:listing) { create(:listing) }

    it 'updates the resource' do
      expect {
        make_request
      }.to change { Listing.count }.by(-1)

      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
