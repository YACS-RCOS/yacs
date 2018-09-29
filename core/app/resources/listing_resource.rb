class ListingResource < ApplicationResource
  attribute :shortname, :string
  attribute :longname, :string
  attribute :description, :string
  attribute :min_credits, :integer
  attribute :max_credits, :integer
  attribute :active, :boolean
  attribute :tags, :array
  attribute :auto_attributes, :hash
  attribute :override_attributes, :hash
  attribute :uuid, :string
  attribute :course_id, :integer
  attribute :term_id, :integer
end
