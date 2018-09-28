require 'rails_helper'

RSpec.describe "courses#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v6/courses", params: params
  end

  describe 'basic fetch' do
    let!(:course1) { create(:course) }
    let!(:course2) { create(:course) }

    it 'works' do
      expect(CourseResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.map(&:jsonapi_type).uniq).to match_array(['courses'])
      expect(d.map(&:id)).to match_array([course1.id, course2.id])
    end
  end
end
