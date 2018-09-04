require 'rails_helper'

RSpec.describe "listings#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/listings",
      params: params
  end

  describe 'basic fetch' do
    let!(:listing1) { create(:listing) }
    let!(:listing2) { create(:listing) }

    it 'serializes the list correctly' do
      make_request
      expect(json_ids(true)).to match_array([listing1.id, listing2.id])
      assert_payload(:listing, listing1, json_items[0])
      assert_payload(:listing, listing2, json_items[1])
    end
  end
end
