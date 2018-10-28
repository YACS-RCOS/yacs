class Listing < ActiveRecord::Base
  belongs_to :course
  belongs_to :term
  has_many   :sections, dependent: :destroy
  validates  :longname, presence: true
  validates :course_id, uniqueness: { scope: :term_id}

  scope :latest, ->(value) {
    joins(:term).where('terms.shortname = (SELECT MAX(terms.shortname) FROM terms WHERE listings.term_id = terms.id AND listings.active = true)')
  }

  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
