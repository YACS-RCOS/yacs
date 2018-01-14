class AddInstructorsToSections < ActiveRecord::Migration[4.2]
  def change
    add_column :sections, :instructors, :string, array: true, default: [], null: false
  end
end
