class ScheduleResource < ApplicationResource
  self.adapter = Graphiti::Adapters::Null

  def base_scope
    { sort: {} }
  end

  sort_all do |scope, attribute|
      scope[:sort].merge!(attribute: attribute)
  end

  def resolve scope
    Schedule.where scope
    schedules = Schedule.where scope
    if scope[:sort].present?
      if sort[:attribute] == :average_start
        schedules.sort_by.reverse { |this_schedule| this_schedule.average_start }
      elsif sort[:attribute] == :average_finish
        schedules.sort_by { |this_schedule| this_schedule.average_finish }
      else
        schedules
      end
    else
      schedules
    end
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
  #   eq do |scope, value|
  #     scope[:course_id] = value
  #   end
  # end
end
