require 'concurrent'
require_relative 'concurrent_helper'

class PollTask
  include Concurrent::Promises::FactoryMethods
  include Concurrent::Promises::CustomHelpers

  # Create a new PollTask
  #
  # @param [PollableSource, #poll_with_retry] pollable the data source we should poll
  # @param [Integer] poll_interval the interval on which we should poll
  # @param [Integer] poll_interval the maximum time we should wait for pollable.poll
  # @param [Integer] poll_interval the interval on which we should retry if pollable.poll fails
  def initialize pollable:, poll_interval:, retry_count:, retry_delay:, config:
    @pollable = pollable
    @poll_interval = poll_interval
    @timeout_interval = timeout_interval
    @retry_delay = retry_delay
    @retry_count = retry_count
    @logger = config.logger.with_fields log_fields
  end

  # Start polling indefinitely, and yield the result of each poll
  #
  # @yieldparam [Hash] result the result from one polling operation
  def perform &block
    @logger.info :poll_task_start
    every poll_interval do
      perform_once.then { |result| yield result }
    end
  end

  def log_fields
    { poll_task: { poll_interval: @poll_interval } }.merge @pollable.log_fields
  end

  private

  # Perform a single polling operation with retries
  #
  # @return [Future<Hash>]
  def perform_once
    @pollable.poll_with_retry count: @retry_count, delay: @retry_delay
  end
end
