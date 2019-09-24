class AddStatusToSections < ActiveRecord::Migration[5.1]
  def change
    add_column :sections, :status, :string, null: true, default: nil
  end
end
