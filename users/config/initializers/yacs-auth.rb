Yacs::Auth.configure do |config|

  config.secret = 'It_is_a_secret'
  config.redis = Redis.new(host: 'redis', port: 6379)

end
