class Api::V6::ListingResource < JSONAPI::Resource
  attributes :longname
  belongs_to :course
  belongs_to :term
  has_many   :sections
end
