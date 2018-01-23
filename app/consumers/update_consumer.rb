class UpdateConsumer < ApplicationConsumer

  def consume
    record = @type.constantize.find_by! uuid: @data[:uuid]
    record.update! @data
  end
end
