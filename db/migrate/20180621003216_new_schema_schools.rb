class NewSchemaSchools < ActiveRecord::Migration[5.1]
  def change
    rename_column :schools, :name, :longname
  end
end
