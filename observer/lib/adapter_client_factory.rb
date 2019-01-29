require_relative 'adapter_factory'
require_relative 'poll_task'
require_relative 'pollable_source'
require_relative 'source_differ'

class AdapterClientFactory
	class << self
		def build adapter_config:, term_shortname:, logger:
			url = url_for adapter_config, term_shortname
			pollable = Pollable.new
				name: adapter_config[:name],
				url: adapter_config[:url],
				logger: logger
			poll_task = PollTask.new
				pollable: pollable,
				poll_interval: adapter_config[:poll_interval],
				retry_count: adapter_config[:retry_count],
				retry_delay: adapter_config[:retry_delay],
				config: config

			differ = SourceDiffer.new
			AdapterClient.new 
		end

		private

		def build_url adapter_config, term_shortname
			version_major = 'v' + adapter_config[:version].to_i
			URI.join adapter_config[:root_url], version_major, term_shortname
		end
	end
end
