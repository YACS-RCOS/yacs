require 'karafka'

class ConsumerApp < Karafka::App
  setup do |config|
    config.client_id = 'core'
    config.backend = :inline
    config.batch_fetching = false
    config.batch_consuming = false
    config.kafka.seed_brokers = %w(kafka://kafka:9092)
  end
end
