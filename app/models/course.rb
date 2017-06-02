class Course < ActiveRecord::Base
  belongs_to :department
  has_many   :sections, dependent: :destroy
  validates  :number, presence: true, uniqueness: { scope: :department_id }
  default_scope { order(number: :asc) }

  after_create do 
    puts "Course added"
    require 'json'
    tempHash = {
      "event_type" => "some event type",
      "data" => {
        "id" => "0",
        "name" => "#{name}",
        "number" => "#{number}",
        "update" => {
          "fieldname" => "courseadded",
          "section" => {
            "name" => "0",
            "crn" => "0",
          },
          "before" => "0",
          "after" =>  "0",
        }
      }
    }
    File.open("addcoursetest.json","w") do |f|
      f.write(tempHash.to_json)
    end
  end

  after_destroy do 
    puts "Course removed"
    require 'json'
    tempHash = {
      "event_type" => "some event type",
      "data" => {
        "id" => "0",
        "name" => "#{name}",
        "number" => "#{number}",
        "update" => {
          "fieldname" => "courseremoved",
          "section" => {
            "name" => "0",
            "crn" => "0",
          },
          "before" => "0",
          "after" =>  "0",
        }
      }
    }
    File.open("removecoursetest.json","w") do |f|
      f.write(tempHash.to_json)
    end
  end

  def self.get code, number
    joins(:department).where("departments.code = ? AND number = ?", code, number).first
  end

  def self.search params
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
    courses = find_by_sql(query).uniq
    ActiveRecord::Associations::Preloader.new.preload(courses, :sections)
    courses
  end

  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
