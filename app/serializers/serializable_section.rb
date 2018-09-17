# Serializers define the rendered JSON for a model instance.
# We use jsonapi-rb, which is similar to active_model_serializers.
class SerializableSection < JSONAPI::Serializable::Resource
  type :sections

  # Add attributes here to ensure they get rendered, .e.g.
  #
  # attribute :name
  #
  # To customize, pass a block and reference the underlying @object
  # being serialized:
  #
  # attribute :name do
  #   @object.name.upcase
  # end
  attribute :shortname
  attribute :crn
  attribute :seats
  attribute :seats_taken
  attribute :conflict_ids
  attribute :uuid
  attribute :periods
  attribute :instructor_ids
  attribute :listing_id
end
