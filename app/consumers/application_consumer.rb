class ApplicationConsumer < Karafka::BaseController
  ALLOWED_TYPES = %w(school department course section)

  include Karafka::Controllers::Callbacks

  after_fetched do
    @type = params[:type]
    @data = params[@type]
    unless ALLOWED_TYPES.include? @type
      throw "ERROR: Disallowed Type: #{@type}"
    end
  end
end
