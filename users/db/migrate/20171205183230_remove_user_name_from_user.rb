class RemoveUserNameFromUser < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :username
  end
end
