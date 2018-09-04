# Define payloads that can be re-used across endpoints.
#
# For instance, you may create Tag objects via the /tags endpoint.
# You may also sidepost Tag objects via the /posts endpoint.
# Here is where the Tag payload can be defined. For example:
#
# strong_resource :tag do
#   attribute :name, :string
#   attribute :active, :boolean
# end
#
# You can now reference this payload across controllers:
#
# class TagsController < ApplicationController
#   strong_resource :tag
# end
#
# class PostsController < ApplicationController
#   strong_resource :post do
#     has_many :tags, disassociate: true, destroy: true
#   end
# end
#
# Custom types can be added here as well:
# Parameters = ActionController::Parameters
# strong_param :pet_type, swagger: :string, type: Parameters.enum('Dog', 'Cat')
#
# strong_resource :pet do
#   attribute :type, :pet_type
# end
#
# For additional documentation, see https://jsonapi-suite.github.io/strong_resources
StrongResources.configure do
  strong_resource :section do
    attribute :shortname, :string
    attribute :crn, :string
    attribute :seats, :integer
    attribute :seats_taken, :integer
    attribute :conflict_ids, :array
    attribute :uuid, :uuid
    attribute :periods, :jsonb
    attribute :instructor_ids, :array
  end
  strong_resource :term do
    attribute :shortname, :string
    attribute :longname, :string
    attribute :uuid, :uuid
  end
  strong_resource :subject do
    attribute :shortname, :string
    attribute :longname, :string
    attribute :school_id, :integer
    attribute :uuid, :uuid
  end
  strong_resource :listing do
    attribute :term_id, :integer
    attribute :course_id, :integer
    attribute :longname, :string
    attribute :description, :string
    attribute :min_credits, :integer
    attribute :max_credits, :integer
    attribute :tags, :array
  end
  strong_resource :instructor do
    attribute :longname, :string
  end
  strong_resource :course do
    attribute :subject_id, :integer
    attribute :number, :string
    attribute :uuid, :uuid
  end
  strong_resource :school do
    attribute :longname, :string
    attribute :uuid, :uuid
  end
end
