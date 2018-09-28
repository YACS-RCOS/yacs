class Api::V6::SubjectsController < Api::V6::ApiController
  def index
    subjects = SubjectResource.all(params)
    respond_with(subjects)
  end

  def show
    subject = SubjectResource.find(params)
    respond_with(subject)
  end

  def create
    subject = SubjectResource.build(params)

    if subject.save
      render jsonapi: subject, status: 201
    else
      render jsonapi_errors: subject
    end
  end

  def update
    subject = SubjectResource.find(params)

    if subject.update_attributes
      render jsonapi: subject
    else
      render jsonapi_errors: subject
    end
  end

  def destroy
    subject = SubjectResource.find(params)

    if subject.destroy
      render jsonapi: { meta: {} }, status: 200
    else
      render jsonapi_errors: subject
    end
  end
end
