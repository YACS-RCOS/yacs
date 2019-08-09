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

  def average_start()
    return @average_start if (@average_start != 0)
    @average_start = 0

    first_periods = Hash.new(9999999999999)

    num_days = 0
    @sections.map do |this_section|
      this_section.periods.map do |p|
        num_days += 1.0 if (last_periods[p["day"]] == -1)
        first_periods[p["day"]] = p["start"].to_i if (p["start"].to_i < first_periods[p["day"]])
      end
    end
    first_periods.map { |day, time| @average_start += time }

    @average_start /= num_days
  end

  def average_finish()
    return @average_finish if (@average_finish != 0)
    @average_finish = 0

    last_periods = Hash.new(-1)

    num_days = 0
    @sections.map do |this_section|
      this_section.periods.map do |p|
        num_days += 1.0 if (last_periods[p["day"]] == -1)
        last_periods[p["day"]] = p["end"].to_i if (p["end"].to_i > last_periods[p["day"]])
      end
    end
    last_periods.map { |day, time| @average_finish += time }

    @average_finish /= num_days
  end

  def initialize params
    super
    @sections ||= []
    @uuid ||= SecureRandom.uuid
  end

  def section_id
    self.sections.map(&:id)
  end
end
