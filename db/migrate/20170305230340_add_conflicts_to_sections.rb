class AddConflictsToSections < ActiveRecord::Migration
  def change
    add_column :sections, :conflicts, :integer, array: true, default: [], null: false
  end
end
