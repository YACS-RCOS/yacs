class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  # GET /resource/sign_in
  def new
    # puts '------------------------START--------------------'
    # self.resource = resource_class.new(sign_in_params)
  # clean_up_passwords(resource)
    # yield resource if block_given?
    # respond_with(resource, serialize_options(resource))
    # puts '------------------------DONE--------------------'
    super
  end

  # POST /resource/sign_in
  def create
    puts '------------------------START CREATE--------------------'
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)

    # dummy = {sub: resource.id}
    # puts JWT.encode(dummy, Yacs::Auth.config.secret, 'HS256')
    puts Yacs::Auth.sign_in(resource)
    # user = User.find_by(email: params[:user][:email])
    # render json: user.as_json(), status: :created
    puts '------------------------DONE CREATE--------------------'
    # super
  end

  # DELETE /resource/sign_out
  def destroy
    puts '------------------------User Logged out eyyyyy--------------------'    
    # binding.pry
    Yacs::Auth.sign_out(current_user)
    # super
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    respond_to_on_destroy    
  end




  protected
  def after_sign_in_path_for(resource)
    puts '------------------------AFTER SIGN IN--------------------'
    stored_location_for(resource) || signed_in_root_path(resource)
    
  end
  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
