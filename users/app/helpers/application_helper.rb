module ApplicationHelper
  def add_param(url, param_name, param_value)
    uri = URI(url)
    params = URI.decode_www_form(uri.query || "") << [param_name, param_value]
    uri.query = URI.encode_www_form(params)
    uri.to_s
  end

  # def user_url
  #   session[:redirect_url]
  # end
end
