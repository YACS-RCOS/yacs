class Section < ActiveRecord::Base
  belongs_to :course
  validates  :name, presence: true, uniqueness: { scope: :course_id }
  validates  :crn, presence: true, uniqueness: true
  default_scope { order(name: :asc) }
  before_save :sort_periods, if: :periods_changed?
  after_save :update_conflicts!, if: :periods_changed?

  def self.compute_conflict_ids_for id
    find_by_sql("SELECT sections.id FROM sections WHERE sections.id IN
      (SELECT(unnest(conflict_ids(#{id.to_i})))) ORDER BY ID").map(&:id)
  end

  def conflicts_with(section)
    # TODO: should check the list of conflicts first
    i = 0
    while i < num_periods
      j = 0
      while j < section.num_periods
        if (periods_day[i] == section.periods_day[j] \
            && ((periods_start[i].to_i <= section.periods_start[j].to_i && periods_end[i].to_i >= section.periods_start[j].to_i) \
            || (periods_start[i].to_i >= section.periods_start[j].to_i && periods_start[i].to_i <= section.periods_end[j].to_i)))
          return true
        end
        j += 1
      end
      i += 1
    end
    false
  end

  def update_conflicts!
    new_conflict_ids = self.class.compute_conflict_ids_for(self.id)
    old_conflicts = Section.where(id: self.conflicts)
    new_conflicts = Section.where(id: new_conflict_ids)
    Section.transaction do
      (old_conflicts - new_conflicts).each do |old_conflict|
        old_conflict.update_column :conflicts, old_conflict.conflicts - [self.id]
      end
      (new_conflicts - old_conflicts).each do |new_conflict|
        new_conflict.update_column :conflicts, (new_conflict.conflicts | [self.id]).sort!
      end
      self.update_column :conflicts, new_conflict_ids
    end
  end

  def sort_periods
    periods_info = periods_day.zip periods_start, periods_end, periods_type
    periods_info = periods_info.sort!.transpose
    self.periods_day, self.periods_start, self.periods_end, self.periods_type = periods_info
  end

  def periods_changed?
    (self.changed & %w(periods_start periods_end periods_day periods_type)).any?
  end
end
