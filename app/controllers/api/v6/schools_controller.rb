class Api::V6::SchoolsController < Api::V6::ApiController
  def index
    schools = SchoolResource.all(params)
    respond_with(schools)
  end

  def show
    school = SchoolResource.find(params)
    respond_with(school)
  end

  def create
    school = SchoolResource.build(params)

    if school.save
      render jsonapi: school, status: 201
    else
      render jsonapi_errors: school
    end
  end

  def update
    school = SchoolResource.find(params)

    if school.update_attributes
      render jsonapi: school
    else
      render jsonapi_errors: school
    end
  end

  def destroy
    school = SchoolResource.find(params)

    if school.destroy
      render jsonapi: { meta: {} }, status: 200
    else
      render jsonapi_errors: school
    end
  end
end
