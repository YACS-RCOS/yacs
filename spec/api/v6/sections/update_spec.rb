require 'rails_helper'

RSpec.describe "sections#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/sections/#{section.id}", payload
  end

  describe 'basic update' do
    let!(:section) { create(:section) }

    let(:payload) do
      {
        data: {
          id: section.id.to_s,
          type: 'sections',
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
      }.to change { section.reload.attributes }
      assert_payload(:section, section, json_item)

      # ... assert updates attributes ...
    end
  end
end
