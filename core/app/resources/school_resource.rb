class SchoolResource < ApplicationResource
  include UuidFilterable

  has_many :subjects

  attribute :longname, :string
end
