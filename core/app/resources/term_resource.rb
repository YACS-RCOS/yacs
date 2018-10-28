class TermResource < ApplicationResource
  include UuidFilterable

  has_many :listings

  attribute :shortname, :string
  attribute :longname, :string
end
