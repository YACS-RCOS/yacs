class Api::V6::TermResource < JSONAPI::Resource
  attributes :shortname, :longname
  has_many   :listings
end
