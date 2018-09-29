require 'rails_helper'

RSpec.describe "courses#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v6/courses/#{course.id}"
  end

  describe 'basic destroy' do
    let!(:course) { create(:course) }

    it 'updates the resource' do
      expect(CourseResource).to receive(:find).and_call_original
      expect { make_request }.to change { Course.count }.by(-1)
      expect { course.reload }
        .to raise_error(ActiveRecord::RecordNotFound)
      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
