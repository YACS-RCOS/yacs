class TermSerializer
  include FastJsonapi::ObjectSerializer
  attributes :shortname, :longname
  has_many :listings
end
