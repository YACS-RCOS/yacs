class CreateSemesterCourses < ActiveRecord::Migration
  def change
    create_table :semester_courses do |t|
      t.integer :semester_id                      ,null:false
      t.integer :course_id                        ,null:false
      t.timestamps                                 null:false
    end
    add_index :semester_courses, :semester_id                               #speed up queries for semester_id
    add_index :semester_courses, :course_id                                 #speed up queries for course_id
    add_index :semester_courses, [:semester_id, :course_id], unique:true    #speeed up queries for semester_id and course_id combinations
  end
end
