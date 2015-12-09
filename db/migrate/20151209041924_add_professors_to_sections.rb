class AddProfessorsToSections < ActiveRecord::Migration
  def change
    add_column :sections, :professors, :string, array: true, default: []
  end
end
