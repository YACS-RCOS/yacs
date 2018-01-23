class CreateConsumer < ApplicationConsumer

  def consume
    @type.constantize.create! @data
  end
end
