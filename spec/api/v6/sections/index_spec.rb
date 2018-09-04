require 'rails_helper'

RSpec.describe "sections#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/sections",
      params: params
  end

  describe 'basic fetch' do
    let!(:section1) { create(:section) }
    let!(:section2) { create(:section) }

    it 'serializes the list correctly' do
      make_request
      expect(json_ids(true)).to match_array([section1.id, section2.id])
      assert_payload(:section, section1, json_items[0])
      assert_payload(:section, section2, json_items[1])
    end
  end
end
