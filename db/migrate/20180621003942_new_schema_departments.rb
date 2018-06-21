class NewSchemaDepartments < ActiveRecord::Migration[5.1]
  def change
    rename_column :departments, :name, :longname
    rename_column :departments, :code, :shortname
  end
end
