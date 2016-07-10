require 'coveralls'

task :test do
  Coveralls.wear_merged!
  ['rspec', 'cucumber'].each do |cmd|
    system "bundle exec #{cmd}"
  end
end
