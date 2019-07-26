class Schedule
  include ActiveModel::Model
  attr_accessor :sections
  attr_accessor :uuid
  attr_accessor :sortValue
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

  def sortSchedules
    avgStart = 0
    avgFinish = 0

    firstPeriods = Hash.new(9999999999999)
    lastPeriods = Hash.new(-1)
    numDays = 0
    sections.each do |this_section|
      this_section.periods.each do |p|
        numDays += 1.0 if (lastPeriods[p["day"]] == -1)
        firstPeriods[p["day"]] = p["start"].to_i if (p["start"].to_i < firstPeriods[p["day"]])
        lastPeriods[p["day"]] = p["end"].to_i if (p["end"].to_i > lastPeriods[p["day"]])
      end
    end
    firstPeriods.each { |day, time| avgStart += time }
    lastPeriods.each { |day, time| avgFinish += time }

    firstPeriods /= numDays
    lastPeriods /= numDays
  end

  def initialize params
    super
    @sections ||= []
    @uuid ||= SecureRandom.uuid
    @avgStart ||= 0
    @avgFinish ||= 0
  end

  def section_id
    self.sections.map(&:id)
  end
end
