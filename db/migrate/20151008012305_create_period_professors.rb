class CreatePeriodProfessors < ActiveRecord::Migration
  def change
    create_table :period_professors do |t|
      t.string :professor_id                  ,null:false
      t.string :period_id                     ,null:false
      t.timestamps                             null:false
    end
    add_index :period_professors, :professor_id                             # speed up queries using professor_id
    add_index :period_professors, :period_id                                # speed up queries using period_id
    add_index :period_professors, [:professor_id, :period_id], unique:true  # speed up queries using combinations of professor_id and period_id
  end
end
