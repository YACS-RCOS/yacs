class Listing < ActiveRecord::Base
  belongs_to :course
  belongs_to :term
  has_many   :sections, dependent: :destroy
  validates  :longname, presence: true
  validates :course_id, uniqueness: { scope: :term_id}

  scope :latest, ->(value) {
    joins(:term).where('terms.shortname = (SELECT MAX(terms.shortname) FROM terms WHERE listings.term_id = terms.id AND listings.active = true)')
  }

  # TODO: refactor this to not require 2 queries
  scope :matches_search, ->(value) {
    where(id: search(value))
  }

  def self.search search_string
    search_params = search_string.gsub(/[^0-9a-z\-\s]/i, '').split.join(' & ')
    query = <<-SQL
      SELECT * FROM (
        SELECT DISTINCT
          listings.id,
          to_tsvector(subjects.longname) ||
          to_tsvector(subjects.shortname) ||
          to_tsvector(to_char(courses.shortname, '9999')) ||
          to_tsvector(listings.longname) ||
          to_tsvector(sections.crn) ||
          to_tsvector(coalesce((string_agg(array_to_string(sections.instructors, ' '), ' ')), '')) ||
          to_tsvector(coalesce((string_agg(array_to_string(listings.tags, ' '), ' ')), ''))
        AS document FROM listings
        JOIN sections on sections.listing_id = listings.id
        JOIN courses on listings.course_id = courses.id
        JOIN subjects on courses.subject_id = subjects.id
        GROUP BY listings.id, courses.id, sections.id, subjects.id
      ) c_search
      WHERE c_search.document @@ to_tsquery('#{search_params}')
      ORDER BY ts_rank(c_search.document, to_tsquery('#{search_params}')) DESC
      LIMIT 25;
    SQL
    find_by_sql(query).uniq.map(&:id)
  end

  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
