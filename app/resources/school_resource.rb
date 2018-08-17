class SchoolResource < JSONAPI::Resource
  attributes :longname
  has_many   :departments
end
