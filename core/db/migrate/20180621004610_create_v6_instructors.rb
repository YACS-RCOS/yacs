class CreateV6Instructors < ActiveRecord::Migration[5.1]
  def up
    create_table :instructors do |t|
      t.string :longname,             null: false
      t.timestamps                    null: false
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
