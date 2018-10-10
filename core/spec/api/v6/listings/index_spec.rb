require 'rails_helper'

RSpec.describe "listings#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/listings", params: params
  end

  describe 'basic fetch' do
    let!(:listing1) { create(:listing) }
    let!(:listing2) { create(:listing) }

    it 'works' do
      expect(ListingResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.map(&:jsonapi_type).uniq).to match_array(['listings'])
      expect(d.map(&:id)).to match_array([listing1.id, listing2.id])
    end
  end
end
