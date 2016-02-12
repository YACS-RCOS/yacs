json.schools @schools do |school|
  json.(school, :id, :name)
  json.departments school.departments do |department|
    json.(department, :id, :code, :name)
  end
end
json.departments @departments do |department|
  json.(department, :id, :code, :name)
end