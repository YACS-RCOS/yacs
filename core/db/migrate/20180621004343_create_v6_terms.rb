class CreateV6Terms < ActiveRecord::Migration[5.1]
  def up
    create_table :terms do |t|
      t.string :shortname,            null: false
      t.string :longname,             null: false
      t.timestamps                    null: false
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
