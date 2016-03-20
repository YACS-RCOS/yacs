class CoursesSweeper < BaseSweeper
  observe Course, Section

  def expire_data record
    super record
    course = record.is_a?(Course) ? course : record.course
    expire_fragment "api/v5/courses/index.xml?department_id=#{course.department_id}"
  end
end