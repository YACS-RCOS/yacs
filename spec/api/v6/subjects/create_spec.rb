require 'rails_helper'

RSpec.describe "subjects#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/subjects", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'subjects',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'creates the resource' do
      expect {
        make_request
      }.to change { Subject.count }.by(1)
      subject = Subject.last

      assert_payload(:subject, subject, json_item)
    end
  end
end
