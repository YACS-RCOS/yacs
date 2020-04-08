require 'concurrent'
require_relative 'adapter_factory'
require_relative 'poll_task'
require_relative 'pollable'
require_relative 'source_differ'
require_relative 'concurrent_helper'
require_relative 'logging'

class AdapterClient
	include Concurrent::Promises::FactoryMethods
	include Concurrent::Promises::CustomHelpers
	include Logging

	def initialize name:, poll_task:, differ:, state_store:
		@name = name
		@poll_task = poll_task
		@differ = differ
		@state_store = state_store
	end

	def start
		@poll_task.perform.then do |new_state|
			future { diff new_state, last_state }
				.then { |changes| push_changes changes; changes }
				.then { |_| update_state new_state; _ }
				.then { |_| log_pass :info, :adapter_client_flow_complete, _ }
				.rescue { |reason| log_raise :error, :adapter_client_flow_failure, reason }
			end
		end
	end

	def log_fields
		{ adapter_client: { name: @name } }
	end

	private

	def diff newer, older
		@differ.diff newer, older
		logger.info :adapter_client_pushed_changes
	end

	def push_changes changes
		@pipeline.produce_batch changes
		logger.info, :adapter_client_updated_state
	end

	def last_state
		@state_store.get
	end

	def update_state new_state
		@state_store.set new_state
	end
end

class AdapterClient::Factory
	class << self
		def build adapter_config:, term_shortname:, logger:
			url = url_for adapter_config, term_shortname
			pollable = Pollable.new
				name: adapter_config[:name],
				url: url,
				logger: logger
			poll_task = PollTask.new
				pollable: pollable,
				poll_interval: adapter_config[:poll_interval],
				retry_count: adapter_config[:retry_count],
				retry_delay: adapter_config[:retry_delay],
				logger: logger
			differ = SourceDiffer.new
			state_store = StateStore.new key: url, logger: logger
			AdapterClient.new
				name: adapter_config[:name],
				poll_task: poll_task,
				differ: differ,
				state_store: state_store,
				logger: logger
		end

		private

		def url_for adapter_config, term_shortname
			version_major = 'v' + adapter_config[:version].to_i
			URI.join adapter_config[:root_url], version_major, term_shortname
		end
	end
end
