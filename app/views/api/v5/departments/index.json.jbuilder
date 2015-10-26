json.version 4
json.result @departments do |department|
  json.id   department.id
  json.code department.code
  json.name department.name
end
