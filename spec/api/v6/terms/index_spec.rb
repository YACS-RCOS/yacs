require 'rails_helper'

RSpec.describe "terms#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/terms", params: params
  end

  describe 'basic fetch' do
    let!(:term1) { create(:term) }
    let!(:term2) { create(:term) }

    it 'works' do
      expect(TermResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.map(&:jsonapi_type).uniq).to match_array(['terms'])
      expect(d.map(&:id)).to match_array([term1.id, term2.id])
    end
  end
end
