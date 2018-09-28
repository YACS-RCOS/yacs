class SubjectResource < ApplicationResource
  attribute :shortname, :string
  attribute :longname, :string
  attribute :uuid, :string
  attribute :school_id, :integer
end
