class NewSchemaSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :sessions do |t|
      t.string :shortname,            null: false
      t.string :longname,             null: false
      t.timestamps                    null: false
    end
  end
end
