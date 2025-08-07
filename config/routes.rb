Rails.application.routes.draw do
  get "hr/index"
  get "documents/index"
  get "documents/show"
  get "department_boards/index"
  get "department_boards/show"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Hospital Management System routes
  root 'home#login'
  get 'login', to: 'home#login'
  get 'dashboard', to: 'home#index'
  
  # Intranet features
  resources :announcements, only: [:index, :show]
  resources :department_boards, only: [:index, :show], path: 'boards'
  resources :documents, only: [:index, :show]
  get 'hr', to: 'hr#index'
end
