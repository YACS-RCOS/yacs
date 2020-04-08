class ChangeEvent
	attr_accessor :method, :type, :attributes, :relationships
end


class Schema

	attr_reader :type, :key, :belongs_to

	def intiailize type:, key:, belongs_to: []
		@type = type
		@key = key

	end

end


class Record
	def initialize attributes:

	end
end
