source 'https://rubygems.org'

ruby '2.2.3'

gem 'puma', '2.16.0'

gem 'rails', '4.2.5.1'
gem 'pg'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'

gem 'handlebars_assets'
gem 'sprockets-rails', :require => 'sprockets/railtie'

gem 'actionpack-page_caching'
gem 'actionpack-action_caching'
gem 'rails-observers'
gem 'dalli'

# See https://github.com/rails/execjs#readme for more supported runtimes
gem 'therubyracer', platforms: :ruby

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'responders', '~> 2.0'

gem 'crono'

gem 'newrelic_rpm'

gem 'coveralls'

gem 'redis'

group :development, :test do
  gem 'pry'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-byebug', '~> 1.3.3'
  gem 'railroady'
end

group :test do
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  gem 'pickle'
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
