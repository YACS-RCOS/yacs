class ScheduleResource < ApplicationResource
  self.adapter = Graphiti::Adapters::Null

  def base_scope
    { sort: {} }
  end

  sort_all do |scope, attribute, direction|
      scope[:sort].merge!(average_start: thisAttribute, : thisDirection)
  end
=begin
  def order(scope, this_attribute, this_direction)
    scope[:sort].merge!(attribute: this_attribute, direction: this_direction)
    scope
  end
=end
  def resolve scope
    schedules = Schedule.where scope
    schedules.map do |this_schedule|
      this_schedule.average_start()
      this_schedule.average_finish()
    end
    if scope[:sort].present?
      if sort[:attribute] == "average_start"
        schedules.sort_by! { |this_schedule| this_schedule.average_start }
        schedules.reverse! if sort[:direction] == "desc"
        return schedules
      elsif sort[:attribute] == "average_finish"
        schedules.sort_by! { |this_schedule| this_schedule.average_finish }
        schedules.reverse! if sort[:direction] == "desc"
        return schedules
      else
        return schedules
      end
    else
      schedules
    end
  end

  has_many :sections,
    foreign_key: :id,
    primary_key: :section_id
  attribute :uuid, :string
  attribute :average_start, :string
  attribute :average_finish, :string
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
