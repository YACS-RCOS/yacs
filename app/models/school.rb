# == Schema Information
#
# Table name: schools
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class School < ActiveRecord::Base
  include ActiveRecord::Diff
  diff exclude: [:created_at, :updated_at]

  has_many :departments, dependent: :destroy
end
