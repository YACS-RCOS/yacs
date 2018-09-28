require 'rails_helper'

RSpec.describe "sections#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/sections/#{section.id}", params: params
  end

  describe 'basic fetch' do
    let!(:section) { create(:section) }

    it 'works' do
      expect(SectionResource).to receive(:find).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.jsonapi_type).to eq('sections')
      expect(d.id).to eq(section.id)
    end
  end
end
