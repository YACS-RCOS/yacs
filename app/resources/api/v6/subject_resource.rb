class Api::V6::SubjectResource < JSONAPI::Resource
  attributes :shortname, :longname
  belongs_to :department
  has_many   :courses
end