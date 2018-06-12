class Professor < ActiveRecord::Base
  # entirely new model
  # many professors to a section and many sections to a professor
  belongs_to :section
  has_many :sections, dependent: :destroy
  validates :longname, presence: true
end
