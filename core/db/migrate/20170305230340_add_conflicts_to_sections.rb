class AddConflictsToSections < ActiveRecord::Migration[4.2]
  def change
    add_column :sections, :conflicts, :integer, array: true, default: [], null: false
  end
end
