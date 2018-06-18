class NewSchema < ActiveRecord::Migration[5.1]
  def change
    # modify schools table
    rename_column :schools, :name, :longname

    # modify departments table
    rename_column :departments, :name, :longname
    rename_column :departments, :code, :shortname

    # create subjects table
    create_table :subjects do |t|
      t.integer :department_id,       null: false
      t.string  :shortname,           null: false
      t.string  :longname,            null: false
      t.timestamps                    null: false
    end

    # modify courses table
    remove_column :courses, :name
    remove_column :courses, :description
    remove_column :courses, :min_credits
    remove_column :courses, :max_credits
    remove_column :courses, :department_id
    add_column    :courses, :subject_id

    # create sessions table
    create_table :sessions do |t|
      t.string :shortname,            null: false
      t.string :longname,             null: false
      t.timestamps                    null: false
    end

    # create listings table
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
    add_index :listings, [:subject_id, :longname], unique: true # search by name within subject

    # modify sections table
    rename_column :sections, :conflicts, :conflict_ids
    rename_column :sections, :name, :shortname
    remove_column :sections, :course_id
    remove_column :sections, :num_periods
    remove_column :sections, :periods_day
    remove_column :sections, :periods_start
    remove_column :sections, :periods_end
    remove_column :sections, :periods_type
    remove_column :sections, :periods_location
    remove_column :sections, :instructors
    add_column    :sections, :periods, :jsonb, null: false, default: '{}'

    # create instructors table
    create_table :instructors do |t|
      t.string :longname,             null: false
      t.timestamps                    null: false
    end
  end
end
