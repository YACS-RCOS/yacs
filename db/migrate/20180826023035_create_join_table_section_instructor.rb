class CreateJoinTableSectionInstructor < ActiveRecord::Migration[5.1]
  def change
    create_join_table :sections, :instructors do |t|
      t.index [:section_id, :instructor_id]
    end
  end
end
