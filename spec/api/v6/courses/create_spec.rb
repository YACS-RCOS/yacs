require 'rails_helper'

RSpec.describe "courses#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/courses", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'courses',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'creates the resource' do
      expect {
        make_request
      }.to change { Course.count }.by(1)
      course = Course.last

      assert_payload(:course, course, json_item)
    end
  end
end
