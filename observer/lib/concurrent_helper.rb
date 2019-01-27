module Concurrent
	module Promises
		module CustomeHelpers
			def log_raise *args
				reason = args[2] || args[1]
				@logger.send *args
				raise reason
			end

			def log_pass *args
				result = args.pop
				@logger.send *args
				result
			end

			def every interval, &task
				schedule(interval, task)
					.chain { every interval, task }
			end

			def retry
				# TODO
			end
		end
	end
end

# class Concurrent::Promises::Future
# 	def log_pass *args, &task
# 		@logger.info
# 	end
# end
