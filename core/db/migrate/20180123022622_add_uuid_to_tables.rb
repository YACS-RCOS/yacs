class AddUuidToTables < ActiveRecord::Migration[5.1]
  def change
    %i(schools departments courses sections).each do |table|
      add_column table, :uuid, :uuid, null: false
      add_index table, :uuid
    end
  end
end
