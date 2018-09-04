require 'rails_helper'

RSpec.describe "terms#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v6/terms/#{term.id}"
  end

  describe 'basic destroy' do
    let!(:term) { create(:term) }

    it 'updates the resource' do
      expect {
        make_request
      }.to change { Term.count }.by(-1)

      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
