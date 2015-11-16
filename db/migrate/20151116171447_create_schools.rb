class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string :name,   null: false
      t.timestamps      null: false
    end
  end
end
