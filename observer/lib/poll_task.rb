class PollTask

  # Create a new PollTask
  #
  # @param [PollableSource, #poll] pollable the source we should poll
  # @param [Integer] poll_interval the interval on which we should poll
  # @param [Integer] poll_interval the maximum time we should wait for pollable.poll
  # @param [Integer] poll_interval the interval on which we should retry if pollable.poll fails
  def initialize pollable, poll_interval:, timeout_interval:, retry_interval:

  end

  # Start polling indefinitely
  def start

  end

end