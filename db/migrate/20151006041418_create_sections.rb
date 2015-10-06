class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.integer :number,      null: false
      t.integer :crn,         null: false
      t.integer :course_id,   null: false
      t.integer :semester_id, null: false
      t.integer :seats,       null: false
      t.integer :seats_taken, null: false
      t.timestamps            null: false
    end
    add_index :sections, :semester_id
    add_index :sections, [:semester_id, :crn], unique: true
    add_index :sections, [:semester_id, :course_id]
    add_index :sections, [:semester_id, :course_id, :number], unique: true
  end
end
