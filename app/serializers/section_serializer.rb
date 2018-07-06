class SectionSerializer
  include FastJsonapi::ObjectSerializer
  attributes :shortname, :crn, :seats, :seats_taken, :conflict_ids, :periods
  has_and_belongs_to_many :instructors
end
