class AddInstructorsToSections < ActiveRecord::Migration
  def change
    add_column :sections, :instructors, :string, array: true, default: [], null: false
  end
end
