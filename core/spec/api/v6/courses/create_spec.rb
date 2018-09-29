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

    it 'works' do
      expect(CourseResource).to receive(:build).and_call_original
      expect {
        make_request
      }.to change { Course.count }.by(1)
      expect(response.status).to eq(201)
    end
  end
end
