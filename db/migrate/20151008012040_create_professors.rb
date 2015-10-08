class CreateProfessors < ActiveRecord::Migration
  def change
    create_table :professors do |t|
      t.string :name      ,null:false
      t.timestamps         null:false
    end
    add_index :professors, :name # speed up search by professor name
  end
end
