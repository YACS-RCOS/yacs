class UpgradeV6Subjects < ActiveRecord::Migration[5.1]
  def up
    rename_table :departments, :subjects
    rename_column :subjects, :code, :shortname
    rename_column :subjects, :name, :longname
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
