class Api::V6::CoursesController < Api::V6::ApiController
  def index
    courses = CourseResource.all(params)
    respond_with(courses)
  end

  def show
    course = CourseResource.find(params)
    respond_with(course)
  end

  def create
    course = CourseResource.build(params)

    if course.save
      render jsonapi: course, status: 201
    else
      render jsonapi_errors: course
    end
  end

  def update
    course = CourseResource.find(params)

    if course.update_attributes
      render jsonapi: course
    else
      render jsonapi_errors: course
    end
  end

  def destroy
    course = CourseResource.find(params)

    if course.destroy
      render jsonapi: { meta: {} }, status: 200
    else
      render jsonapi_errors: course
    end
  end
end
