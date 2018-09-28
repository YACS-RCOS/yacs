require 'rails_helper'

RSpec.describe "subjects#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/subjects/#{subject.id}", payload
  end

  describe 'basic update' do
    let!(:subject) { create(:subject) }

    let(:payload) do
      {
        data: {
          id: subject.id.to_s,
          type: 'subjects',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect(SubjectResource).to receive(:find).and_call_original
      expect {
        make_request
      }.to change { subject.reload.attributes }
      expect(response.status).to eq(200)
    end
  end
end
