module UuidFilterable
  extend ActiveSupport::Concern
  included do
    attribute :uuid, :string
    filter :uuid, :string do
      eq do |scope, value|
        scope.where(uuid: value)
      end
      eql do |scope, value|
        scope.where(uuid: value)
      end
    end
  end
end