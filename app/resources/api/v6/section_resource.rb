class Api::V6::SectionResource < JSONAPI::Resource
  attributes :shortname, :crn
  has_many :instructors
end
