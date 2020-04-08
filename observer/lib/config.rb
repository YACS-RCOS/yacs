require 'ougai'

class Config
	attr_accessor :logger

	def intialize
		logger = Ougai::Logger.new(STDOUT)
	end

	class << self
		def get
			@config ||= config.new
		end
	end
end
