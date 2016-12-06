FROM solr:6.3

bundle exec rake sunspot:reindex
COPY schema.xml /opt/solr/configsets/sunspot/conf/schema.xml