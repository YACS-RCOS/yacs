class CreateV6Listings < ActiveRecord::Migration[5.1]
  def up
    create_table :listings do |t|
      t.integer :term_id,             null: false
      t.integer :course_id,           null: false
      t.uuid    :uuid,                null: false
      t.string  :longname,            null: false
      t.text    :description
      t.integer :min_credits,         null: false
      t.integer :max_credits,         null: false
      t.boolean :active,              null: false, default: false
      t.jsonb   :auto_attributes,     null: false, default: '{}'
      t.jsonb   :override_attributes, null: false, default: '{}'
      t.string  :tags,                null: false, array: true, default: []
      t.timestamps                    null: false
    end

    add_index :listings, :longname
    add_index :listings, :tags
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
