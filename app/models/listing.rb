class Listing < ActiveRecord::Base
  belongs_to :course
  belongs_to :session
  has_many   :sections, dependent: :destroy
  validates  :longname, presence: true

  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
