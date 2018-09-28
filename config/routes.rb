Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  scope path: ApplicationResource.endpoint_namespace, defaults: { format: :jsonapi } do
    resources :terms
    resources :schools
    resources :subjects
    resources :courses
    resources :listings
    resources :sections
    resources :instructors
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

  scope path: '/api' do
    resources :docs, only: [:index], path: '/swagger'
  end
end
