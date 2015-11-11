class Api::V5::ApiController < ActionController::Metal
  include AbstractController::Rendering
  include ActionController::MimeResponds
  include ActionController::ImplicitRender
  include ActionView::Layouts

  append_view_path "#{Rails.root}/app/views"
end