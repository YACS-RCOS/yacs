require_relative 'lib/adapter_client'

ADAPTERS_CONFIG_FILE = ENV['ADAPTERS_CONFIG'] || './adapters.yml'

adapters_config = YAML.load(ADAPTERS_CONFIG_FILE)

