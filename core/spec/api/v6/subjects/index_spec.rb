require 'rails_helper'

RSpec.describe "subjects#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/subjects", params: params
  end

  describe 'basic fetch' do
    let!(:subject1) { create(:subject) }
    let!(:subject2) { create(:subject) }

    it 'works' do
      expect(SubjectResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.map(&:jsonapi_type).uniq).to match_array(['subjects'])
      expect(d.map(&:id)).to match_array([subject1.id, subject2.id])
    end
  end
end
