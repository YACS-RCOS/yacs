require 'rails_helper'

RSpec.describe "instructors#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v6/instructors/#{instructor.id}", payload
  end

  describe 'basic update' do
    let!(:instructor) { create(:instructor) }

    let(:payload) do
      {
        data: {
          id: instructor.id.to_s,
          type: 'instructors',
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
      }.to change { instructor.reload.attributes }
      assert_payload(:instructor, instructor, json_item)

      # ... assert updates attributes ...
    end
  end
end
