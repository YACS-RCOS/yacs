Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  namespace :api do
    namespace :v5 do
      resources :schools,     only: [:index]
      resources :departments, only: [:index]
      resources :courses,     only: [:index]
      resources :sections,    only: [:index]
      resources :schedules,   only: [:index]
    end
  end

  get '/' => 'static#index'
end