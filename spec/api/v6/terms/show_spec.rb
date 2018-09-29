require 'rails_helper'

RSpec.describe "terms#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/terms/#{term.id}", params: params
  end

  describe 'basic fetch' do
    let!(:term) { create(:term) }

    it 'works' do
      expect(TermResource).to receive(:find).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.jsonapi_type).to eq('terms')
      expect(d.id).to eq(term.id)
    end
  end
end
