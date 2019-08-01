class Schedule
  include ActiveModel::Model
  attr_accessor :sections
  attr_accessor :uuid
  attr_accessor :sort_value
  alias_method :id, :uuid

  def self.where params
    if params[:section_id]
      self.from_sections Section.where(id: params[:section_id])
    else
      []
    end
  end

  def self.from_sections sections
    Scheduler.all_schedules(sections).map do |section_list|
      Schedule.new(sections: section_list)
    end
  end

  def find_sort_values
    avg_start = 0
    avg_finish = 0

    first_periods = Hash.new(9999999999999)
    last_periods = Hash.new(-1)
    num_days = 0
    sections.each do |this_section|
      this_section.periods.each do |p|
        num_days += 1.0 if (last_periods[p["day"]] == -1)
        first_periods[p["day"]] = p["start"].to_i if (p["start"].to_i < first_periods[p["day"]])
        last_periods[p["day"]] = p["end"].to_i if (p["end"].to_i > last_periods[p["day"]])
      end
    end
    first_periods.each { |day, time| avg_start += time }
    last_periods.each { |day, time| avg_finish += time }

    avg_start /= num_days
    avg_finish /= num_days
  end

  def initialize params
    super
    @sections ||= []
    @uuid ||= SecureRandom.uuid
    @avg_start ||= 0
    @avg_finish ||= 0
  end

  def section_id
    self.sections.map(&:id)
  end
end
