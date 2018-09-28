require 'rails_helper'

RSpec.describe "schools#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/schools/#{school.id}", params: params
  end

  describe 'basic fetch' do
    let!(:school) { create(:school) }

    it 'works' do
      expect(SchoolResource).to receive(:find).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.jsonapi_type).to eq('schools')
      expect(d.id).to eq(school.id)
    end
  end
end
