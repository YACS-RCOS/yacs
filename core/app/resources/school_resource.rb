class SchoolResource < ApplicationResource
	has_many :subjects

  attribute :longname, :string
  attribute :uuid, :string
end
