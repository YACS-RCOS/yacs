require 'rails_helper'

RSpec.describe "instructors#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v6/instructors/#{instructor.id}"
  end

  describe 'basic destroy' do
    let!(:instructor) { create(:instructor) }

    it 'updates the resource' do
      expect {
        make_request
      }.to change { Instructor.count }.by(-1)

      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
