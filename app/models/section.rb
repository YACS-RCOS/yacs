class Section < ActiveRecord::Base
  belongs_to :course
  validates  :name, presence: true, uniqueness: { scope: :course_id }
  validates  :crn, presence: true, uniqueness: true
  default_scope { order(name: :asc) }
  before_save :sort_periods, if: :periods_changed?
  after_save :update_conflicts!, if: :periods_changed?

  after_create do 
    puts "Section added"
    require 'json'
    tempHash = {
      "event_type" => "some event type",
      "data" => {
        "id" => "0",
        "name" => "#{course.name}",
        "number" => "#{course.number}",
        "update" => {
          "fieldname" => "sectionadded",
          "section" => {
            "name" => "#{name}",
            "crn" => "#{crn}",
          },
          "before" => "0",
          "after" =>  "0",
        }
      }
    }
    File.open("addsectiontest.json","w") do |f|
      f.write(tempHash.to_json)
    end
  end

  after_destroy do 
    puts "Section removed"
    require 'json'
    tempHash = {
      "event_type" => "some event type",
      "data" => {
        "id" => "0",
        "name" => "#{course.name}",
        "number" => "#{course.number}",
        "update" => {
          "fieldname" => "sectionremoved",
          "section" => {
            "name" => "#{name}",
            "crn" => "#{crn}",
          },
          "before" => "0",
          "after" =>  "0",
        }
      }
    }
    File.open("removesectiontest.json","w") do |f|
      f.write(tempHash.to_json)
    end
  end
  
  after_update do  
    send_message = false
    if((self.changed & %w(seats)).any? and (seats_was > seats))
      puts "#{seats_was - seats} seats removed"
      fieldname = "seatsremoved"
      before = seats_was
      after = seats
      send_message = true
    end
    if((self.changed & %w(seats)).any? and (seats_was < seats))
      puts "#{seats - seats_was} seat(s) added"
      fieldname = "seatsadded"
      before = seats_was
      after = seats
      send_message = true
    end
    if((self.changed & %w(seats_taken)).any? and seats_taken >= seats and seats_taken_was < seats) #checks specifically if there were open seats beforehand and none open after
      puts "Section closed"
      fieldname = "sectionclosed"
      before = seats_taken_was
      after = seats_taken
      send_message = true
    end
    if((self.changed & %w(seats_taken)).any? and seats_taken_was >= seats and seats_taken < seats) 
      puts "Section opened"
      fieldname = "sectionopened"
      before = seats_taken_was
      after = seats_taken
      send_message = true
    end
    if(send_message)
      require 'json'
      tempHash = {
        "event_type" => "some event type",
        "data" => {
          "id" => "0",
          "name" => "#{course.name}",
          "number" => "#{course.number}",
          "update" => {
            "fieldname" => "#{fieldname}",
            "section" => {
              "name" => "#{name}",
              "crn" => "#{crn}",
            },
            "before" => "#{before}",
            "after" =>  "#{after}",
          }
        }
      }
      File.open("sectionupdatetest.json","w") do |f|
        f.write(tempHash.to_json)
      end
    end
  end

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
