class AddPeriodsLocationToSections < ActiveRecord::Migration[5.1]
  def change
    add_column :sections, :periods_location, :string, array: true, default: [], null: false
  end
end
