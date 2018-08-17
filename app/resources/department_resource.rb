class DepartmentResource < JSONAPI::Resource
  attributes :shortname, :longname
  belongs_to :school
  has_many   :subjects
end
