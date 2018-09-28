# ApplicationResource is similar to ApplicationRecord - a base class that
# holds configuration/methods for subclasses.
# All Resources should inherit from ApplicationResource.
class ApplicationResource < Graphiti::Resource
  # Use the ActiveRecord Adapter for all subclasses.
  # Subclasses can still override this default.
  self.abstract_class = true
  self.adapter = Graphiti::Adapters::ActiveRecord
  self.base_url = Rails.application.routes.default_url_options[:host]
  self.endpoint_namespace = '/api/v6'
end
