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
      expect {
        make_request
      }.to change { subject.reload.attributes }
      assert_payload(:subject, subject, json_item)

      # ... assert updates attributes ...
    end
  end
end
