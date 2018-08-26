class NewSchemaTerms < ActiveRecord::Migration[5.1]
  def change
    create_table :terms do |t|
      t.string :shortname,            null: false
      t.string :longname,             null: false
      t.timestamps                    null: false
    end
  end
end
