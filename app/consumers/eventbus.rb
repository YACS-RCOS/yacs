require "plezi"
#Builing an eventbus that can store data from different instances, need at least a port/file
#Pub/SUb pattern applied
#One Bus for all instances
#Try RabbitMQ, need port 5672, but can collect data from different instances
class EventBus

def initialize(data)
end

def self.store(data)
end

def self.read
end

def close
end

end
