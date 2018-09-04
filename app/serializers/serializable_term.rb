# Serializers define the rendered JSON for a model instance.
# We use jsonapi-rb, which is similar to active_model_serializers.
class SerializableTerm < JSONAPI::Serializable::Resource
  type :terms

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
  attribute :longname
  attribute :uuid
end
