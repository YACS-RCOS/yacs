class ScheduleResource < ApplicationResource
	self.adapter = Graphiti::Adapters::Null

	def base_scope
		{ }
	end

	def resolve scope
		Schedule.where scope
	end

	has_many :sections,
		foreign_key: :id,
		primary_key: :section_id
	attribute :uuid, :string
	attribute :section_id, :integer, only: [:filterable]

	filter :section_id do
		eq do |scope, value|
			{ section_id: value }.merge(scope)
		end
	end

	# filter :course_id do
	# 	eq do |scope, value|
	# 		scope[:course_id] = value
	# 	end
	# end
end
