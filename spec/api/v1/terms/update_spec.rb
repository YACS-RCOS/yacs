require 'rails_helper'

RSpec.describe "terms#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/terms/#{term.id}", payload
  end

  describe 'basic update' do
    let!(:term) { create(:term) }

    let(:payload) do
      {
        data: {
          id: term.id.to_s,
          type: 'terms',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect(TermResource).to receive(:find).and_call_original
      expect {
        make_request
      }.to change { term.reload.attributes }
      expect(response.status).to eq(200)
    end
  end
end
