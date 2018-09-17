# Serializers define the rendered JSON for a model instance.
# We use jsonapi-rb, which is similar to active_model_serializers.
class SerializableListing < JSONAPI::Serializable::Resource
  type :listings\
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
  attribute :term_id
  attribute :course_id
  attribute :longname
  attribute :description
  attribute :min_credits
  attribute :max_credits
  attribute :tags
  attribute :uuid
end
