task :travis do
  system 'export DISPLAY=:99.0 && bundle exec rake test'
  raise 'testing failed!' unless $?.exitstatus == 0
end
