class RemoveInstructors < ActiveRecord::Migration[5.1]
  def change
    remove_column :sections, :instructor_ids
    drop_table :instructors
    add_column :sections, :instructors, :string, array: true, null: false, default: []
  end
end
