require 'rails_helper'

RSpec.describe "courses#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/courses/#{course.id}", payload
  end

  describe 'basic update' do
    let!(:course) { create(:course) }

    let(:payload) do
      {
        data: {
          id: course.id.to_s,
          type: 'courses',
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
      }.to change { course.reload.attributes }
      assert_payload(:course, course, json_item)

      # ... assert updates attributes ...
    end
  end
end
