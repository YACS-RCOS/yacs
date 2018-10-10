require 'rails_helper'

RSpec.describe "terms#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/terms", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'terms',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'works' do
      expect(TermResource).to receive(:build).and_call_original
      expect {
        make_request
      }.to change { Term.count }.by(1)
      expect(response.status).to eq(201)
    end
  end
end
