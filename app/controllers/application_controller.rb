class ApplicationController < ActionController::Base
  include Graphiti::Rails
  include Graphiti::Responders

  register_exception Graphiti::Errors::RecordNotFound,
    status: 404

  rescue_from Exception do |e|
    handle_exception(e)
  end
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
end
