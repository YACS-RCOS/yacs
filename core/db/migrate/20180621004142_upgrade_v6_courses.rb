class UpgradeV6Courses < ActiveRecord::Migration[5.1]
  def up
    remove_column :courses, :name
    remove_column :courses, :description
    remove_column :courses, :min_credits
    remove_column :courses, :max_credits
    remove_column :courses, :tags
    rename_column :courses, :number, :shortname
    rename_column :courses, :department_id, :subject_id
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
