class NewSchemaSubjects < ActiveRecord::Migration[5.1]
  def change
    create_table :subjects do |t|
      t.integer :department_id,       null: false
      t.string  :shortname,           null: false
      t.string  :longname,            null: false
      t.timestamps                    null: false
    end
  end
end
