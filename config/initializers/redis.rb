require "redis"

Redis.current = Redis.new(host: 'redis', port: 6379)
