require 'rails_helper'

RSpec.describe "schools#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v6/schools/#{school.id}"
  end

  describe 'basic destroy' do
    let!(:school) { create(:school) }

    it 'updates the resource' do
      expect(SchoolResource).to receive(:find).and_call_original
      expect { make_request }.to change { School.count }.by(-1)
      expect { school.reload }
        .to raise_error(ActiveRecord::RecordNotFound)
      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
