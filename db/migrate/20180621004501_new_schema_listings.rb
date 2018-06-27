class NewSchemaListings < ActiveRecord::Migration[5.1]
  def change
    create_table :listings do |t|
      t.integer :session_id,          null: false
      t.integer :course_id,           null: false
      t.string  :longname,            null: false
      t.text    :description,         null: false
      t.integer :min_credits,         null: false
      t.integer :max_credits,         null: false
      t.boolean :active,              null: false, default: false
      t.jsonb   :auto_attributes,     null: false, default: '{}'
      t.jsonb   :override_attributes, null: false, default: '{}'
      t.timestamps                    null: false
    end

    add_index :listings, :longname                              # search by name
    # add_index :listings, [:subject_id, :longname], unique: true # search by name within subject
  end
end
