class DestroyConsumer < ApplicationConsumer

  def consume
    record = @type.capitalize.constantize.find_by! uuid: @data[:uuid]
    record.destroy!
  end
end
