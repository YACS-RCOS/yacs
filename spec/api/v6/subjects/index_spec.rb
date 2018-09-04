require 'rails_helper'

RSpec.describe "subjects#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/subjects",
      params: params
  end

  describe 'basic fetch' do
    let!(:subject1) { create(:subject) }
    let!(:subject2) { create(:subject) }

    it 'serializes the list correctly' do
      make_request
      expect(json_ids(true)).to match_array([subject1.id, subject2.id])
      assert_payload(:subject, subject1, json_items[0])
      assert_payload(:subject, subject2, json_items[1])
    end
  end
end
