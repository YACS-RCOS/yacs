class Api::V5::ApiController < ActionController::Metal
  include AbstractController::Rendering
  include AbstractController::Callbacks
  include ActionController::MimeResponds
  include ActionController::ImplicitRender
  include ActionController::Caching
  include ActionController::Instrumentation
  include ActionView::Layouts

  append_view_path "#{Rails.root}/app/views"

  self.page_cache_directory = Rails.public_path
  self.perform_caching = true
  self.cache_store = :dalli_store
  
  before_filter :nested_queries, only: [:index]

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
end