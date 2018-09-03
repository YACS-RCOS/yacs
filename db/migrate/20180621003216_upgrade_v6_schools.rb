class UpgradeV6Schools < ActiveRecord::Migration[5.1]
  def up
    rename_column :schools, :name, :longname
  end

  def down
  	raise ActiveRecord::IrreversibleMigration
  end
end
