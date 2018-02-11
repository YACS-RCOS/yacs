class CreateConsumer < ApplicationConsumer

  def consume
    @type.capitalize.constantize.create! @data
  end
end
