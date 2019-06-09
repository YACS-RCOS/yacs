require 'concurrent'
require_relative 'concurrent_helper'
require_relative 'logging'

class PollTask
  include Concurrent::Promises::FactoryMethods
  include Concurrent::Promises::CustomHelpers
  include Logging

  # Create a new PollTask
  #
  # @param [Pollable, #poll] pollable the data source we should poll
  # @param [Integer] poll_interval the interval on which we should poll
  # @param [Integer] retry_count the maximum time we should wait for pollable.poll
  # @param [Integer] retry_delay the interval on which we should retry if pollable.poll fails
  def initialize pollable:, poll_interval:, retry_count:, retry_delay:
    @pollable = pollable
    @poll_interval = poll_interval
    @timeout_interval = timeout_interval
    @retry_delay = retry_delay
    @retry_count = retry_count
  end

  # Start polling indefinitely, and yield the result of each poll
  #
  # @yieldparam [Future<Hash>] result the result from one polling operation
  def perform &block
    logger.info :poll_task_start
    every @poll_interval do
      with_retries @retry_count, @retry_delay do
        yield perform_once
      end
    end
  end

  def log_fields
    { poll_task: { poll_interval: @poll_interval } }.merge @pollable.log_fields
  end

  private

  # Performs the task once
  #
  # @return [Future<Hash>]
  def perform_once
    @pollable.poll
  end
end
