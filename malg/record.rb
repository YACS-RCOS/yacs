class RecordFactory
  def initialize schema
    @schema = schema
  end

  def generate_ohm_classes
    @classes = @schema.types.map do |type, props|
      generate_class type, props
    end
  end

  private

  def generate_class type, props
    Class.new(Ohm::Model) do 
      props['attributes'].each { |attr| attribute attr }
      parent = props['parent_type']
      reference parent, @schema.singularize(parent).capitalize if parent
    end
  end
end