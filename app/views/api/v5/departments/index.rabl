child(@schools => :schools) do
  collection @schools, root: :schools, object_root: false
  attributes :id, :name
  child(:departments, :object_root => false) do
    attributes :id, :name
    node :codename do |dept|
      dept.code
    end
  end
end
child(@departments => :departments) do
  collection @departments, root: :departments, object_root: false
  attributes :id, :name
  node :codename do |dept|
    dept.code
  end
end