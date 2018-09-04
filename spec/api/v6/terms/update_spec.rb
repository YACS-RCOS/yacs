require 'rails_helper'

RSpec.describe "terms#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/terms/#{term.id}", payload
  end

  describe 'basic update' do
    let!(:term) { create(:term) }

    let(:payload) do
      {
        data: {
          id: term.id.to_s,
          type: 'terms',
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
      }.to change { term.reload.attributes }
      assert_payload(:term, term, json_item)

      # ... assert updates attributes ...
    end
  end
end
