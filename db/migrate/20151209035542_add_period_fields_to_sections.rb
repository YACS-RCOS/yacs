class AddPeriodFieldsToSections < ActiveRecord::Migration
  def change
    change_table :sections do |t|
      t.integer :num_periods
      t.integer :periods_day,   array: true, default: []
      t.integer :periods_start, array: true, default: []
      t.integer :periods_end,   array: true, default: []
      t.integer :periods_type,  array: true, default: []
    end
  end
end
