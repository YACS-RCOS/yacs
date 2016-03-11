class RemoveIndexFromCourses < ActiveRecord::Migration
  def change
    remove_index :courses, ["department_id", "name"]
  end
end