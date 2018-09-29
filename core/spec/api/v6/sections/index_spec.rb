require 'rails_helper'

RSpec.describe "sections#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/sections", params: params
  end

  describe 'basic fetch' do
    let!(:section1) { create(:section) }
    let!(:section2) { create(:section) }

    it 'works' do
      expect(SectionResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.map(&:jsonapi_type).uniq).to match_array(['sections'])
      expect(d.map(&:id)).to match_array([section1.id, section2.id])
    end
  end
end
