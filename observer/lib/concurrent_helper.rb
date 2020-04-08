require_relative 'logging'

module Concurrent
	module Promises
		module CustomeHelpers
			prepend Logging

			def log_raise *args
				reason = args[2] || args[1]
				logger.send *args
				raise reason
			end

			def log_pass *args
				result = args.pop if args.size > 2
				logger.send *args
				result
			end

			def every interval, &task
				schedule(interval, task)
					.chain { every interval, task }
			end

			def with_retries count, delay, &task
				task.call.rescue do |last_reason|
					if count > 0 then with_retries count -1, delay, &task
					else log_raise :error, :retries_exceeded, last_reason
				end
			end
		end
	end
end

# class Concurrent::Promises::Future
# 	def log_pass *args, &task
# 		logger.info
# 	end
# end
