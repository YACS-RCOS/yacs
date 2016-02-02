class Course < ActiveRecord::Base
  belongs_to  :department
  has_many    :sections
  validates :name, :number, uniqueness: { scope: :department_id }
  default_scope { order(number: :asc) }

  def self.search(params)
    query = <<-SQL
      SELECT *
      FROM ( SELECT courses.* as cs,
        to_tsvector(departments.name) ||
        to_tsvector(departments.code) ||
        to_tsvector(to_char(courses.number, '9999')) ||
        to_tsvector(courses.name) ||
        to_tsvector(coalesce((string_agg(array_to_string(sections.instructors, ' '), ' ')), ''))
        AS document
        FROM courses
        JOIN sections on sections.course_id = courses.id
        JOIN departments on courses.department_id = departments.id
        GROUP BY courses.id, sections.id, departments.id
      ) c_search
      WHERE c_search.document @@ to_tsquery('#{params.join(' & ')}');
    SQL
    find_by_sql(query).each {|c| c.name}
  end
end
