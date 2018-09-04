require 'rails_helper'

RSpec.describe "sections#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v6/sections", payload
  end

  describe 'basic create' do
    let(:payload) do
      {
        data: {
          type: 'sections',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    it 'creates the resource' do
      expect {
        make_request
      }.to change { Section.count }.by(1)
      section = Section.last

      assert_payload(:section, section, json_item)
    end
  end
end
