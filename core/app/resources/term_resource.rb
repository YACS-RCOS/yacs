class TermResource < ApplicationResource
	has_many :listings

  attribute :shortname, :string
  attribute :longname, :string
  attribute :uuid, :string
end
