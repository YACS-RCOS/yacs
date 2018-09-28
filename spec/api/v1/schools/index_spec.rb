require 'rails_helper'

RSpec.describe "schools#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/schools", params: params
  end

  describe 'basic fetch' do
    let!(:school1) { create(:school) }
    let!(:school2) { create(:school) }

    it 'works' do
      expect(SchoolResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.map(&:jsonapi_type).uniq).to match_array(['schools'])
      expect(d.map(&:id)).to match_array([school1.id, school2.id])
    end
  end
end
