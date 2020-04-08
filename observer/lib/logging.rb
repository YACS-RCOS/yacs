require 'active_support/core_ext'

module Logging
	def logger
		@logger ||= Ougai::Logger.new(STDOUT).with_fields(try(:log_fields) || {})
	end
end
