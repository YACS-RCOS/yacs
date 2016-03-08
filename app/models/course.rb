# == Schema Information
#
# Table name: courses
#
#  id            :integer          not null, primary key
#  department_id :integer          not null
#  name          :string           not null
#  number        :integer          not null
#  min_credits   :integer          not null
#  max_credits   :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  description   :text             default("")
#

class Course < ActiveRecord::Base
  belongs_to  :department
  has_many    :sections
  validates :name, :number, uniqueness: { scope: :department_id }
  default_scope { order(number: :asc) }

  def self.search(params)
    search_params = params.join(' & ')
    Rails.cache.fetch("#{search_params}-#{cache_key}", expires_in: 3.hours) do
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
  end

  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
