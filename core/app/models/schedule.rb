class Schedule
  include ActiveModel::Model
  attr_accessor :sections
  attr_accessor :uuid
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

  def initialize params
    super
    @sections ||= []
    @uuid ||= SecureRandom.uuid
  end

  def section_id
    self.sections.map(&:id)
  end
end
