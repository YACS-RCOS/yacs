class Term < ActiveRecord::Base
  has_many   :listings, dependent: :destroy
  validates  :shortname, presence: true, uniqueness: true
  validates  :longname, presence: true, uniqueness: true
  default_scope { order(shortname: :asc) }

  before_create :generate_uuid

  private

  def generate_uuid
    self.uuid = SecureRandom.uuid
  end
end
