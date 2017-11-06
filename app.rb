require './source_manager'

source_manager = SourceManager.new 'sources.yml'
source_manager.start_all
source_manager.watch