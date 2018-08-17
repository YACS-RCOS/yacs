class SectionResource < JSONAPI::Resource
  attributes :shortname, :crn
  has_and_belongs_to_many :instructors
end
