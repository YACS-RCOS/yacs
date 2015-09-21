class CreateSemesters < ActiveRecord::Migration
  def change
    create_table :semesters do |t|
      t.string :season, null: false
      t.timestamps		null: false
    end
    add_index :semesters, :season, unique: true
  end
end
