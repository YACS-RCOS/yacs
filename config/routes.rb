Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  namespace :api, defaults: { format: :json } do
    namespace :v5 do
      resources :schools,     only: [:index, :update, :destroy]
      resources :departments, only: [:index, :update, :destroy]
      resources :courses,     only: [:index, :update, :destroy]
      resources :sections,    only: [:index, :update, :destroy]
      resources :schedules,   only: [:index, :update, :destroy]
    end
  end  

  get '/' => 'static#index'
  get '/about' => 'static#about'
end
