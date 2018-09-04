require 'rails_helper'

RSpec.describe "listings#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/listings/#{listing.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:listing) { create(:listing) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:listing, listing, json_item)
    end
  end
end
