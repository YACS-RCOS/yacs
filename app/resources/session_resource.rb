class SessionResource < JSONAPI::Resource
  attributes :shortname, :longname
  has_many   :listings
end
