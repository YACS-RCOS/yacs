class Course < ActiveRecord::Base
  belongs_to  :department
  has_many    :sections
  validates :name, :number, uniqueness: { scope: :department_id }
  default_scope { order(number: :asc) }

  def self.search(params)
    search_params = params.join(' & ')
    query = <<-SQL
      SELECT * FROM (
        SELECT DISTINCT
          courses.*,
          to_tsvector(departments.name) ||
          to_tsvector(departments.code) ||
          to_tsvector(to_char(courses.number, '9999')) ||
          to_tsvector(courses.name) ||
          to_tsvector(coalesce((string_agg(array_to_string(sections.instructors, ' '), ' ')), ''))
        AS document FROM courses
        JOIN sections on sections.course_id = courses.id
        JOIN departments on courses.department_id = departments.id
        GROUP BY courses.id, sections.id, departments.id
      ) c_search
      WHERE c_search.document @@ to_tsquery('#{search_params}')
      ORDER BY ts_rank(c_search.document, to_tsquery('#{search_params}')) DESC
      LIMIT 25;
    SQL
    find_by_sql(query).uniq
  end

  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
