class Instance
  attr_reader :graph

  def initialize schema_config, priorities_config, sources_config, uni_shortname, term_shortname
    @transport = EventTransport.new uni_shortname, term_shortname
    @schema = Schema.new schema_config
    @priorities = Priorities.new priorities_config
    @graph = Graph.new uni_shortname, term_shortname, @priorities, @schema, @transport
    @sources = SourceFactory.load_sources sources_config, uni_shortname, term_shortname
    @source_manager = SourceManager.new @sources
    @source_manager.register_all @graph
  end

  def start
    should_build = !@graph.load
    @source_manager.start_all
    @source_manager.start_watcher
    @graph.build @source_manager.sources if should_build
  end
end
