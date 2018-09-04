require 'rails_helper'

RSpec.describe "schools#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/schools/#{school.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:school) { create(:school) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:school, school, json_item)
    end
  end
end
