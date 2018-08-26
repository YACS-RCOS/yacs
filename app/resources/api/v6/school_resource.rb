class Api::V6::SchoolResource < JSONAPI::Resource
  attributes :longname
  has_many   :departments
end
