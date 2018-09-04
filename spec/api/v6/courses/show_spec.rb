require 'rails_helper'

RSpec.describe "courses#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/courses/#{course.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:course) { create(:course) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:course, course, json_item)
    end
  end
end
