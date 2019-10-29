class Api::V6::ApiController < ApplicationController
  include Graphiti::Rails
  include Graphiti::Responders

  register_exception Graphiti::Errors::RecordNotFound,
    status: 404

  rescue_from Exception do |e|
    handle_exception(e, show_raw_error: true)
  end

  def allow_graphiti_debug_json?
    true
  end

  # self.page_cache_directory = Rails.public_path
  self.perform_caching = true
  self.cache_store = :redis_store, 'redis://redis:6379/0/cache'
end
