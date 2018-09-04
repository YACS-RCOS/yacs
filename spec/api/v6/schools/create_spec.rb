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

    it 'creates the resource' do
      expect {
        make_request
      }.to change { School.count }.by(1)
      school = School.last

      assert_payload(:school, school, json_item)
    end
  end
end
