class SchoolSerializer
  include FastJsonapi::ObjectSerializer
  attributes :longname, :uuid
  has_many :subjects
end
