class UpdateConsumer < ApplicationConsumer

  def consume
    record = @type.capitalize.constantize.find_by! uuid: @data[:uuid]
    record.update! @data
  end
end
