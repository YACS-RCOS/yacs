require 'rails_helper'

RSpec.describe "sections#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/sections/#{section.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:section) { create(:section) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:section, section, json_item)
    end
  end
end
