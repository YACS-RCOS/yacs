class NewSchemaSections < ActiveRecord::Migration[5.1]
  def change
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
  end
end
