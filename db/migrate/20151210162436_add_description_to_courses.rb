class AddDescriptionToCourses < ActiveRecord::Migration[4.2]
  def change
    add_column :courses, :description, :text, default: ""
  end
end
