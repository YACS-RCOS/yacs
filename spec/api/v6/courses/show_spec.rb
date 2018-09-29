require 'rails_helper'

RSpec.describe "courses#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/courses/#{course.id}", params: params
  end

  describe 'basic fetch' do
    let!(:course) { create(:course) }

    it 'works' do
      expect(CourseResource).to receive(:find).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.jsonapi_type).to eq('courses')
      expect(d.id).to eq(course.id)
    end
  end
end
