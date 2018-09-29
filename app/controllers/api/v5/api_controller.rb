class Api::V5::ApiController < ActionController::Metal
  include AbstractController::Rendering
  include AbstractController::Callbacks
  include ActionController::MimeResponds
  include ActionController::ImplicitRender
  include ActionController::Caching
  include ActionController::Instrumentation
  include ActionView::Layouts
  include ActionController::StrongParameters
  include ActionController::Head
  include ActionController::Rescue
  include ActionController::Redirecting
  
  append_view_path "#{Rails.root}/app/views"

  # self.page_cache_directory = Rails.public_path
  self.perform_caching = true
  self.cache_store = :redis_store, 'redis://redis:6379/0/cache'
  
  before_action :nested_queries, only: [:show, :index]
  before_action :authenticate, except: [:show, :index]

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  private
  def nested_queries
    @show_departments = params.has_key? :show_departments
    @show_courses     = params.has_key? :show_courses
    @show_sections    = params.has_key? :show_sections
    @show_periods     = params.has_key? :show_periods
  end

  protected
  def query
    @query
  end

  def record_not_found
    head :not_found
  end
  
  def any param
    params[param].split(',')
  end

  def filter_model model
    @query = model.all.distinct
  end

  def filter param
    @query = yield @query if params[param].present?
  end

  def filter_any *param
    param.each do |param|
      filter param do |q|
        q.where param => any(param)
      end
    end
  end

  def authenticate
    Rails.env.test? || Rails.env.development?
  end
end
