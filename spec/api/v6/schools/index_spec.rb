require 'rails_helper'

RSpec.describe "schools#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/schools",
      params: params
  end

  describe 'basic fetch' do
    let!(:school1) { create(:school) }
    let!(:school2) { create(:school) }

    it 'serializes the list correctly' do
      make_request
      expect(json_ids(true)).to match_array([school1.id, school2.id])
      assert_payload(:school, school1, json_items[0])
      assert_payload(:school, school2, json_items[1])
    end
  end
end
