class Api::V6::CoursesController < Api::V6::ApiController
  # Mark this as a JSONAPI controller, associating with the given resource
  jsonapi resource: CourseResource

  # Reference a strong resource payload defined in
  # config/initializers/strong_resources.rb
  strong_resource :course
  # Run strong parameter validation for these actions.
  # Invalid keys will be dropped.
  # Invalid value types will log or raise based on the configuration
  # ActionController::Parameters.action_on_invalid_parameters
  before_action :apply_strong_params, only: [:create, :update]

  # Start with a base scope and pass to render_jsonapi
  def index
    courses = Course.all
    render_jsonapi(courses)
  end

  # Call jsonapi_scope directly here so we can get behavior like
  # sparse fieldsets and statistics.
  def show
    scope = jsonapi_scope(Course.where(id: params[:id]))
    instance = scope.resolve.first
    raise JsonapiCompliable::Errors::RecordNotFound unless instance
    render_jsonapi(instance, scope: false)
  end

  # jsonapi_create will use the configured Resource (and adapter) to persist.
  # This will handle nested relationships as well.
  # On validation errors, render correct error JSON.
  def create
    course, success = jsonapi_create.to_a

    if success
      render_jsonapi(course, scope: false)
    else
      render_errors_for(course)
    end
  end

  # jsonapi_update will use the configured Resource (and adapter) to persist.
  # This will handle nested relationships as well.
  # On validation errors, render correct error JSON.
  def update
    course, success = jsonapi_update.to_a

    if success
      render_jsonapi(course, scope: false)
    else
      render_errors_for(course)
    end
  end

  # Renders 200 OK with empty meta
  # http://jsonapi.org/format/#crud-deleting-responses-200
  def destroy
    course, success = jsonapi_destroy.to_a

    if success
      render json: { meta: {} }
    else
      render_errors_for(course)
    end
  end
end
