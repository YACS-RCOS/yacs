class RemoveTimestampsFromTables < ActiveRecord::Migration
  def change
    remove_column :departments, :created_at
    remove_column :departments, :updated_at
    remove_column :schools, :created_at
    remove_column :schools, :updated_at
    remove_column :sections, :created_at
    remove_column :sections, :updated_at
    remove_column :periods, :created_at
    remove_column :periods, :updated_at
    remove_column :courses, :created_at
    remove_column :courses, :updated_at
    remove_column :professors, :created_at
    remove_column :professors, :updated_at
    remove_column :periods_professors, :created_at
    remove_column :periods_professors, :updated_at
  end
end
