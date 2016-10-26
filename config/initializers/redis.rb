require "redis"

Redis.current = Redis.new(host: '127.0.0.1', port: 6379)