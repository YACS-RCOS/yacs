class DestroyConsumer < ApplicationConsumer

  def consume
    record = @type.constantize.find_by! uuid: @data[:uuid]
    record.destroy!
  end
end
