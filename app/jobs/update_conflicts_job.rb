class UpdateConflictsJob < ActiveJob::Base
  queue_as :default

  def perform(section_id)
     section = Section.find(section_id)
     Section.where.not(course_id: section.course_id).each do |other_section|
      if section.conflicts_with other_section
        section.update_column :conflicts, section.conflicts | [other_section.id]
        other_section.update_column :conflicts, other_section.conflicts | [section.id]
      else
        section.update_column :conflicts, section.conflicts - [other_section.id]
        other_section.update_column :conflicts, other_section.conflicts - [section.id]
      end
    end
  end
end
