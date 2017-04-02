Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  namespace :api, defaults: { format: :json } do
    namespace :v5 do
      resources :schools,     only: [:index, :update, :destroy, :create]
      resources :departments, only: [:index, :update, :destroy, :create]
      resources :courses,     only: [:index, :update, :destroy, :create]
      resources :sections,    only: [:index, :update, :destroy, :create]
      resources :schedules,   only: [:index, :update, :destroy, :create]
    end
  end  

  get '/' => 'static#index'
  get '/about' => 'static#about'
end
