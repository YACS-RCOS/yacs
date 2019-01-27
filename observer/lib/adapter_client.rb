require_relative 'pollable'
require_relative 'poll_task'

class AdapterClient

	def initialize adapter_config:, differ:, state_store:, config:
		@pollable = Pollable.new
			name: adapter_config[:name],
			url: adapter_config[:url],
			config: config
		@poll_task = PollTask.new
			pollable: @pollable,
			poll_interval: adapter_config[:poll_interval],
			retry_count: adapter_config[:retry_count],
			retry_delay: adapter_config[:retry_delay],
			config: config
	end

	def start
		@poll_task.perform do |new_state|
			future { diff new_state, last_state }
				.then { |changes| push_changes changes }
				.then { update_state new_state }
			end
		end
	end

	private

	def diff newer, older
		@differ.diff newer, older
	end

	def push_changes changes
		@pipeline.produce_batch changes
	end

	def last_state
		@state_store.get
	end

	def update_state new_state
		@state_store.set new_state
	end
end
