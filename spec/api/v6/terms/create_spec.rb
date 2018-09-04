require 'rails_helper'

RSpec.describe "terms#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/terms", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'terms',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'creates the resource' do
      expect {
        make_request
      }.to change { Term.count }.by(1)
      term = Term.last

      assert_payload(:term, term, json_item)
    end
  end
end
