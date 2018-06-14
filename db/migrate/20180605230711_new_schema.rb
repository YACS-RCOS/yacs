class NewSchema < ActiveRecord::Migration[5.1]
  def change
    # modify schools table
    remove_column :schools, :name
    add_column    :schools, :shortname, :string, null: false
    add_column    :schools, :longname, :string, null: false

    # modify departments table
    remove_column :departments, :name
    remove_column :departments, :code
    add_column    :departments, :shortname, :string, null: false
    add_column    :departments, :longname, :string, null: false

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

    # modify sections table
    remove_column :sections, :name
    remove_column :sections, :course_id
    remove_column :sections, :num_periods
    remove_column :sections, :periods_day
    remove_column :sections, :periods_start
    remove_column :sections, :periods_end
    remove_column :sections, :periods_type
    remove_column :sections, :periods_location
    remove_column :sections, :instructors
    remove_column :sections, :conflicts
    add_column    :sections, :shortname, :string, null: false
    add_column    :sections, :conflict_ids, :integer, array: true, null: false, default: []
    add_column    :sections, :instructor_ids, :integer, array: true, null: false, default: []
    add_column    :sections, :periods, :jsonb, null: false, default: '{}'

    # create professors table
    create_table :professors do |t|
      t.string :longname,             null: false
      t.timestamps                    null: false
    end

    add_index :listings, :longname                              # search by name
    add_index :listings, [:subject_id, :longname], unique: true # search by name within subject
  end
end
