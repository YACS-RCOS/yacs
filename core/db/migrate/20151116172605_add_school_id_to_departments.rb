class AddSchoolIdToDepartments < ActiveRecord::Migration[4.2]
  def change
    add_column :departments, :school_id, :integer
  end
end
