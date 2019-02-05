class Course < ActiveRecord::Base
  belongs_to :subject
  has_many   :listings, dependent: :destroy
  has_one    :latest_listing, -> { latest(true) }, class_name: 'Listing'

  # validates  :number, presence: true, uniqueness: { scope: :subject_id }
  default_scope { order(shortname: :asc) }
  # after_save :send_notification

  before_create { self.uuid ||= SecureRandom.uuid }

  # def send_notification
  #   CoursesResponder.new.call(self)
  # end

  def self.get code, number
    joins(:subject).where("subjects.shortname = ? AND number = ?", shortname, number).first
  end
end
