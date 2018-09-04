require 'rails_helper'

RSpec.describe "instructors#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/instructors/#{instructor.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:instructor) { create(:instructor) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:instructor, instructor, json_item)
    end
  end
end
