# ApplicationResource is similar to ApplicationRecord - a base class that
# holds configuration/methods for subclasses.
# All Resources should inherit from ApplicationResource.
# Resource documentation: https://jsonapi-suite.github.io/jsonapi_compliable/JsonapiCompliable/Resource.html
class ApplicationResource < JsonapiCompliable::Resource
  # Use the ActiveRecord Adapter for all subclasses.
  # Subclasses can still override this default.
  # More on adapters: https://jsonapi-suite.github.io/jsonapi_compliable/JsonapiCompliable/Adapters/Abstract.html
  use_adapter JsonapiCompliable::Adapters::ActiveRecord
end
