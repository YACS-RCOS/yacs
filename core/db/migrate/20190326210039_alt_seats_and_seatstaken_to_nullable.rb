class AltSeatsAndSeatstakenToNullable < ActiveRecord::Migration[5.1]
  def change
    change_column_null :sections, :seats, true
    change_column_default :sections, :seats, nil
    change_column_null :sections, :seats_taken, true
    change_column_default :sections, :seats_taken, nil
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
