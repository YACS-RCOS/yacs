json.departments departments do |department|
  json.(department, :id, :code, :name)
end