class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.string  :name,                    null: false
      t.integer :crn,                     null: false
      t.integer :course_id,               null: false
      t.integer :seats,                   null: false
      t.integer :seats_taken,             null: false
      t.timestamps                        null: false
    end
    add_index :sections, :course_id                          # search by course (thru semester_course)
    add_index :sections, [:course_id, :name], unique: true   # search by course (thru semester_course) and section for scheduling logic and internal processing
  end
end
