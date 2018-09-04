class Api::V6::ApiController < ApplicationController
  # self.page_cache_directory = Rails.public_path
  self.perform_caching = true
  self.cache_store = :redis_store, 'redis://redis:6379/0/cache'

  # Bootstrap jsonapi_suite with relevant modules
  include JsonapiSuite::ControllerMixin

  register_exception JsonapiCompliable::Errors::RecordNotFound,
    status: 404

  # Catch all exceptions and render a JSONAPI-compliable error payload
  # For additional documentation, see https://jsonapi-suite.github.io/jsonapi_errorable
  rescue_from Exception do |e|
    handle_exception(e)
  end
end
