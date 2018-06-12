class Course < ActiveRecord::Base
  # a course is within a subject
  belongs_to :subject
  # now has many listings, each of which has many sections
  has_many   :listings, dependent: :destroy
  validates  :number, presence: true, uniqueness: { scope: :department_id }
  default_scope { order(number: :asc) }

  def self.get code, number
    # now uses shortname instead of code
    joins(:department).where("departments.shortname = ? AND number = ?", shortname, number).first
  end

  def self.search params
    # changed params to corresponding variables in new schema
    search_params = params.join(' & ')
    query = <<-SQL
      SELECT * FROM (
        SELECT DISTINCT
          courses.*,
          to_tsvector(departments.longname) ||
          to_tsvector(departments.shortname) ||
          to_tsvector(to_char(courses.number, '9999')) ||
          to_tsvector(listings.longname) ||
          to_tsvector(coalesce((string_agg(array_to_string(sections.instructors, ' '), ' ')), '')) ||
          to_tsvector(coalesce((string_agg(array_to_string(courses.tags, ' '), ' ')), ''))
        AS document FROM courses
        JOIN sections on sections.course_id = courses.id
        JOIN departments on courses.department_id = departments.id
        GROUP BY courses.id, sections.id, departments.id
      ) c_search
      WHERE c_search.document @@ to_tsquery('#{search_params}')
      ORDER BY ts_rank(c_search.document, to_tsquery('#{search_params}')) DESC
      LIMIT 25;
    SQL
    courses = find_by_sql(query).uniq
    ActiveRecord::Associations::Preloader.new.preload(courses, :sections)
    courses
  end
end
