class CreatePeriods < ActiveRecord::Migration
  def change
    create_table  :periods do |t|
      t.integer   :section_id     ,null:false
      t.string    :time           ,null:false                     #Format: Time1-Time2 Day_of_Week
      t.string    :period_type    ,null:false
      t.string    :location       ,null:false
      t.timestamps                 null:false
    end
    add_index :periods, :section_id #speed up queries for periods wrt section_id
  end
end
