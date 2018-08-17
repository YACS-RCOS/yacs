class InstructorResource < JSONAPI::Resource
  has_and_belongs_to_many :sections
  validates :longname, presence: true
end
