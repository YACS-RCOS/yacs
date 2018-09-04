require 'rails_helper'

RSpec.describe "listings#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/listings", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'listings',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'creates the resource' do
      expect {
        make_request
      }.to change { Listing.count }.by(1)
      listing = Listing.last

      assert_payload(:listing, listing, json_item)
    end
  end
end
