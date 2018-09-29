require 'rails_helper'

RSpec.describe "subjects#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v6/subjects/#{subject.id}"
  end

  describe 'basic destroy' do
    let!(:subject) { create(:subject) }

    it 'updates the resource' do
      expect(SubjectResource).to receive(:find).and_call_original
      expect { make_request }.to change { Subject.count }.by(-1)
      expect { subject.reload }
        .to raise_error(ActiveRecord::RecordNotFound)
      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
