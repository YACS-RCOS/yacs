require 'rails_helper'

RSpec.describe "instructors#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/instructors", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'instructors',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'creates the resource' do
      expect {
        make_request
      }.to change { Instructor.count }.by(1)
      instructor = Instructor.last

      assert_payload(:instructor, instructor, json_item)
    end
  end
end
