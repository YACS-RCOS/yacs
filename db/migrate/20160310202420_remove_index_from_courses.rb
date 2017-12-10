class RemoveIndexFromCourses < ActiveRecord::Migration[4.2]
  def change
    remove_index :courses, ["department_id", "name"]
  end
end