class CreateDepartments < ActiveRecord::Migration
  def change
    create_table :departments do |t|
      t.string :code, 	null: false
      t.string :name, 	null: false
      t.timestamps		null: false
    end
    add_index :departments, :code, unique: true
  end
end
