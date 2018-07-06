class InstructorSerializer
  include FastJsonapi::ObjectSerializer
  attributes :longname
  has_and_belongs_to_many :sections
end
