class CoursesSweeper < BaseSweeper
  observe Course, Section

  def expire_data record
    super record
    course = record.is_a?(Course) ? record : record.course
    expire_fragment "/api/v5/courses.json?department_id=#{course.department_id}"
  end
end