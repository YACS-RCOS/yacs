require 'rails_helper'

RSpec.describe "subjects#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/subjects/#{subject.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:subject) { create(:subject) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:subject, subject, json_item)
    end
  end
end
