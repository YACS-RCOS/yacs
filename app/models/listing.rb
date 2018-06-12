class Listing < ActiveRecord::Base
  belongs_to :course
  belongs_to :session
  # there are many listings of a course, each in a particular session e.g. CSCI 1100, Fall 2018
  has_many   :sections, dependent: :destroy
  validates  :longname, presence: true, uniqueness: true

  # moved credits method here since a listing has credits, not a course (credits can change over time)
  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
