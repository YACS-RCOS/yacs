Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  namespace :api, defaults: { format: :json } do
    namespace :v6 do
      jsonapi_resources :schools
      jsonapi_resources :subjects
      jsonapi_resources :courses
      jsonapi_resources :terms
      jsonapi_resources :listings
      jsonapi_resources :sections
      jsonapi_resources :instructors
    end
  end

  namespace :api, defaults: { format: :json } do
    namespace :v5 do
      resources :schools,     only: [:index, :update, :destroy, :create, :show]
      resources :departments, only: [:index, :update, :destroy, :create, :show]
      resources :courses,     only: [:index, :update, :destroy, :create, :show]
      resources :sections,    only: [:index, :update, :destroy, :create, :show]
      resources :schedules,   only: [:index]
    end
  end

  get '/' => 'static#index'
  get '/about' => 'static#about'
end
