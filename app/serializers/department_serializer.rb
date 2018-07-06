class DepartmentSerializer
  include FastJsonapi::ObjectSerializer
  attributes :shortname, :longname, :uuid
  belongs_to :schools
  has_many :subjects
end
