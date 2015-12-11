class AddDescriptionToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :description, :text, default: ""
  end
end
