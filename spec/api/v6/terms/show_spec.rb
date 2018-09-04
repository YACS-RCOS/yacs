require 'rails_helper'

RSpec.describe "terms#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/terms/#{term.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:term) { create(:term) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:term, term, json_item)
    end
  end
end
