require 'rails_helper'

RSpec.describe "terms#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/terms",
      params: params
  end

  describe 'basic fetch' do
    let!(:term1) { create(:term) }
    let!(:term2) { create(:term) }

    it 'serializes the list correctly' do
      make_request
      expect(json_ids(true)).to match_array([term1.id, term2.id])
      assert_payload(:term, term1, json_items[0])
      assert_payload(:term, term2, json_items[1])
    end
  end
end
