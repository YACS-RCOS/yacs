class ChangeListings < ActiveRecord::Migration[5.1]
  def change
    change_column :listings, :active, :boolean, null: false, default: true
  end
end
