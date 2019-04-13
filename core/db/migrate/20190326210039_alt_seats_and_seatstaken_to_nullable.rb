class AltSeatsAndSeatstakenToNullable < ActiveRecord::Migration[5.1]
  def change
    change_column :sections, :seats, :integer, null: true, default: nil
    change_column :sections, :seats_taken, :integer, null: true, default: nil
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
