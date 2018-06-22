class NewSchemaInstructors < ActiveRecord::Migration[5.1]
  def change
    create_table :instructors do |t|
      t.string :longname,             null: false
      t.timestamps                    null: false
    end
  end
end
