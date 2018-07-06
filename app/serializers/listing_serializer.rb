class ListingSerializer
  include FastJsonapi::ObjectSerializer
  attributes :longname, :description, :min_credits, :max_credits, :active, :auto_attributes, :override_attributes
  belongs_to :courses
  belongs_to :sessions
  has_many :sections
end
