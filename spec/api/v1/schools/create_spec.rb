require 'rails_helper'

RSpec.describe "schools#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/schools", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'schools',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'works' do
      expect(SchoolResource).to receive(:build).and_call_original
      expect {
        make_request
      }.to change { School.count }.by(1)
      expect(response.status).to eq(201)
    end
  end
end
