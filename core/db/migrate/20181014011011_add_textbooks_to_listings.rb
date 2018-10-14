class AddTextbooksToListings < ActiveRecord::Migration[5.1]
  def change
  	add_column :listings, :required_textbooks, :integer, array: true, null: false, default: []
  	add_column :listings, :recommended_textbooks, :integer, array: true, null: false, default: []
  end
end
