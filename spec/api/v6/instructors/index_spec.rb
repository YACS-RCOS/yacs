require 'rails_helper'

RSpec.describe "instructors#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/instructors",
      params: params
  end

  describe 'basic fetch' do
    let!(:instructor1) { create(:instructor) }
    let!(:instructor2) { create(:instructor) }

    it 'serializes the list correctly' do
      make_request
      expect(json_ids(true)).to match_array([instructor1.id, instructor2.id])
      assert_payload(:instructor, instructor1, json_items[0])
      assert_payload(:instructor, instructor2, json_items[1])
    end
  end
end
