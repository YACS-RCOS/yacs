
# XADD
# Append to stream

module Streamers
	class RedisStreams
		attr_accessor :redis

		def initialize redis: Redis.current
			self.redis = redis
		end

		def xadd stream, id: '*', data:
			redis.xadd stream, id, *data.to_a.flatten
		end

		def xlen stream
			redis.xlen stream
		end

		# TODO: Add optional COUNT param
		def xrange stream, _start: '-', _end: '+'
			deserialize_xrange redis.xrange _start, _end
		end

		def xrevrange stream, _start: '-', _end: '+'
			deserialize_xrange redis.xrevrange _start, _end
		end

		private

		def deserialize_xrange result
			result.map { |item| [item[0], Hash[*item[1]]] }
		end
	end
end


module Streamers
	class Consumer

	end
end


module Streamers
	class Producer

	end
end
