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

  def sortSchedules(sortParameter)
    sortValue = 0
    case sortParameter
    when 1                                      #sortValue = avg start time
      firstPeriods = Hash.new(9999999999999)
      numDays = 0
      sections.each do |this_section|
        newDay = nil
        this_section.periods.each do |p|
          if (p["day"] != newDay)
            numDays += 1.0
            newDay = p["day"]
            if (p["start"].to_i < firstPeriods[p["day"]])
              firstPeriods[p["day"]] = p["start"].to_i
            end
          end
        end
      end
      firstPeriods.each do |day, time|
        sortValue += time
      end
      sortValue /= numDays

    when 2                  #sortValue = avg end time
      lastPeriods = Hash.new(-1)
      numDays = 0
      sections.each do |this_section|
        this_section.periods.each do |p|
          numDays += 1.0 if (lastPeriods[p["day"]] == -1)
          if (p["end"].to_i > lastPeriods[p["day"]])
            lastPeriods[p["end"]] = p["day"].to_i
          end
        end
      end
      firstPeriods.each do |day, time|
        sortValue += time
      end
      sortValue /= numDays

    when 3                  #sortValue = avg gap timex
      sortVaue = 0
    end
  end

  def initialize params
    super
    @sections ||= []
    @uuid ||= SecureRandom.uuid
    @sortValue ||= 0    #Default is no sorting
  end

  def section_id
    self.sections.map(&:id)
  end
end
