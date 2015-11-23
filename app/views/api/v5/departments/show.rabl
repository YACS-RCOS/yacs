object @department
attributes :id, :name
node :codename do |dept|
  dept.code
end