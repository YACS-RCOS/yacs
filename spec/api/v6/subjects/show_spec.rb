require 'rails_helper'

RSpec.describe "subjects#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/subjects/#{subject.id}", params: params
  end

  describe 'basic fetch' do
    let!(:subject) { create(:subject) }

    it 'works' do
      expect(SubjectResource).to receive(:find).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.jsonapi_type).to eq('subjects')
      expect(d.id).to eq(subject.id)
    end
  end
end
