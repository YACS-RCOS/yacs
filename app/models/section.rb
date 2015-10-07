class Section < ActiveRecord::Base
	belongs_to :course
	belongs_to :semester

	scope :of_semester -> (semester) { unscoped.where(semester_id: semester.id) }
	scope :of_course -> (semester) { where(course_id: course.id }
	default_scope { of_semester(Semester.last) }
end