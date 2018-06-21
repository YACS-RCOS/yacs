class NewSchemaCourses < ActiveRecord::Migration[5.1]
  def change
    remove_column :courses, :name
    remove_column :courses, :description
    remove_column :courses, :min_credits
    remove_column :courses, :max_credits
    remove_column :courses, :department_id
    add_column    :courses, :subject_id, :integer, null: false
  end
end
