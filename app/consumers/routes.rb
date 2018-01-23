require 'karafka'

ConsumerApp.consumer_groups.draw do
  consumer_group :core do
    topic :all do
      controller ExampleController
    end
  end
end
