class Test < ActiveRecord::Migration[5.1]
  def change
    remove_column :schools, :name
    add_column :schools, :shortname, :string, null: false
    add_column :schools, :longname, :string, null: false
  end
end
