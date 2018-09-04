require 'rails_helper'

RSpec.describe "courses#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/courses",
      params: params
  end

  describe 'basic fetch' do
    let!(:course1) { create(:course) }
    let!(:course2) { create(:course) }

    it 'serializes the list correctly' do
      make_request
      expect(json_ids(true)).to match_array([course1.id, course2.id])
      assert_payload(:course, course1, json_items[0])
      assert_payload(:course, course2, json_items[1])
    end
  end
end
