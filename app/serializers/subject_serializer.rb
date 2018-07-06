class SubjectSerializer
  include FastJsonapi::ObjectSerializer
  attributes :shortname, :longname
  belongs_to :departments
  has_many :courses
end
