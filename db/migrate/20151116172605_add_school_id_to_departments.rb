class AddSchoolIdToDepartments < ActiveRecord::Migration
  def change
    add_column :departments, :school_id, :integer
  end
end
