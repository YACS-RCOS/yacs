source 'https://rubygems.org'

ruby '2.4.2'

gem 'puma', '3.11.0'

gem 'rails', '5.1.4'
gem 'pg'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'

gem 'handlebars_assets'
gem 'sprockets-rails', :require => 'sprockets/railtie'

gem 'actionpack-page_caching'
gem 'actionpack-action_caching'
gem 'rails-observers'

# See https://github.com/rails/execjs#readme for more supported runtimes
gem 'therubyracer', platforms: :ruby

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'responders', '~> 2.0'

gem 'crono'
gem 'httpclient'

gem 'newrelic_rpm'

gem 'coveralls'

gem 'redis'
gem 'redis-rails'
gem 'redis-store', '~> 1.4.0'

gem 'karafka'

gem 'rubyzip', '~> 1.2.1'
gem 'listen'

gem 'jsonapi_suite', '~> 0.7'
gem 'jsonapi-rails', '~> 0.3.0'
gem 'jsonapi_swagger_helpers', '~> 0.6', require: false
gem 'jsonapi_spec_helpers', '~> 0.4', require: false
gem 'kaminari', '~> 1.0'

group :development, :test do
  gem 'pry'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-byebug', '~> 1.3.3'
  gem 'railroady'
  gem 'swagger-diff'
end

group :test do
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  gem 'factory_bot_rails'
  gem 'pickle'
  gem 'faker'
  # gem 'webrat'
  gem 'database_cleaner'
  gem "capybara"
  gem "cucumber-rails", require: false
  gem "poltergeist"
  gem "selenium-webdriver"
end

group :development do
  gem 'web-console', '~> 2.0'
  gem 'spring'
end
