class Course < ActiveRecord::Base
  belongs_to :subject
  has_many   :listings, dependent: :destroy
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

  def self.search params
    search_params = params.join(' & ')
    query = <<-SQL
      SELECT * FROM (
        SELECT DISTINCT
          courses.*,
          to_tsvector(subjects.longname) ||
          to_tsvector(subjects.shortname) ||
          to_tsvector(to_char(courses.number, '9999')) ||
          to_tsvector(listings.longname) ||
          to_tsvector(coalesce((string_agg(array_to_string(sections.instructors, ' '), ' ')), '')) ||
          to_tsvector(coalesce((string_agg(array_to_string(courses.tags, ' '), ' ')), ''))
        AS document FROM courses
        JOIN sections on sections.course_id = courses.id
        JOIN subjects on courses.subject_id = subjects.id
        GROUP BY courses.id, sections.id, subjects.id
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
