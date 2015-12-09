class AddPeriodFieldsToSections < ActiveRecord::Migration
  def change
    change_table :sections do |t|
      t.integer :num_periods,                default: 0,  null: false
      t.integer :periods_day,   array: true, default: [], null: false
      t.integer :periods_start, array: true, default: [], null: false
      t.integer :periods_end,   array: true, default: [], null: false
      t.string  :periods_type,  array: true, default: [], null: false
    end
  end
end
