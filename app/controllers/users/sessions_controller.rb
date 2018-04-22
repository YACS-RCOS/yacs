class Users::SessionsController < Devise::SessionsController
  before_action :store_location
  after_action :create_token, only: [:create]
  before_action :destroy_token, only: [:destroy]
  
  protected

  def store_location
    session[:user_return_to] = params[:referer] if params[:referer].present?
  end

  def create_token
    session[:token] = Yacs::Auth.sign_in resource
  end

  def destroy_token
    Yacs::Auth.sign_out current_user
    session[:token] = nil
  end
end
