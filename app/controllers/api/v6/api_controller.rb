class Api::V6::ApiController < JSONAPI::ResourceControllerMetal
  self.page_cache_directory = Rails.public_path
  self.perform_caching = true
  self.cache_store = :redis_store, 'redis://redis:6379/0/cache'

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
end
