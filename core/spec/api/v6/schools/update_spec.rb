require 'rails_helper'

RSpec.describe "schools#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/schools/#{school.id}", payload
  end

  describe 'basic update' do
    let!(:school) { create(:school) }

    let(:payload) do
      {
        data: {
          id: school.id.to_s,
          type: 'schools',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect(SchoolResource).to receive(:find).and_call_original
      expect {
        make_request
      }.to change { school.reload.attributes }
      expect(response.status).to eq(200)
    end
  end
end
