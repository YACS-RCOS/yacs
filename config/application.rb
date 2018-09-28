require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Yacs
  class Application < Rails::Application
    routes.default_url_options[:host] = ENV.fetch('HOST', 'http://localhost:3000')
    routes.default_url_options[:host] = ENV.fetch('HOST', 'https://localhost')

    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Autoload all lib files
    config.autoload_paths << Rails.root.join('lib')

    # Load the cache sweepers
    # config.active_record.observers = %w{ CoursesSweeper DepartmentsSweeper }

    ActiveSupport.halt_callback_chains_on_return_false = false
  end
end
