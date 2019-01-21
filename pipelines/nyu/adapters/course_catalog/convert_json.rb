require 'oj'
require 'yaml'

input_file = 'processed.json'
output_file = 'subjects.yml'

data = Oj.load_file(input_file)

subjects_raw = data['subjects']
schools_raw = data['acad_groups']

school_subjects = Hash.new { |h,k| h[k] = [] }

subjects_raw.map do |subject|
  shortname = subject['subject']
  longname = subject['descr']
  school_shortname = shortname.split('-')[1]
  school_subjects[school_shortname] << { "shortname" => shortname, "longname" => longname }
end

output = schools_raw.map do |school|
  shortname = school['acad_group']
  {
    "shortname" => shortname,
    "longname" => school['descr'],
    "subjects" => school_subjects[shortname]
  }
end

output = { "schools" => output }

File.open(output_file, 'w') {|f| f.write output.to_yaml }




{"subject"=>"AELS-UF", "descr"=>"Academic Engl for Liberal Stdy", "acad_groups"=>{"group0"=>{"acad_group"=>"UF"}}, "acad_orgs"=>{"org0"=>{"acad_org"=>"UFLSTD"}}, "careers"=>{"career0"=>{"career"=>"UGRD"}}, "campuses"=>{"campus0"=>{"campus"=>"WS"}}, "nyu_locations"=>{"loc0"=>{"location"=>"WS"}}}
