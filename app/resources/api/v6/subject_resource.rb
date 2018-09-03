class Api::V6::SubjectResource < JSONAPI::Resource
  attributes :shortname, :longname
  belongs_to :school
  has_many   :courses
end