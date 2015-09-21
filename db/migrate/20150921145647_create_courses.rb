class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.integer :department_id, null: false
      t.string 	:name, 			null: false
      t.integer :number, 		null: false
      t.integer :min_credits, 	null: false
      t.integer :max_credits, 	null: false
      t.timestamps				null: false
    end
    add_index :courses, [:department_id, :name],	unique: true
    add_index :courses, [:department_id, :number], 	unique: true
  end
end
