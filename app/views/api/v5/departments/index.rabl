child(@schools => :schools) do
  collection @schools, root: :schools, object_root: false
  attributes :id, :name
  child(:departments, :object_root => false) do
    attributes :id, :code, :name
  end
end
child(@departments => :departments) do
  collection @departments, root: :departments, object_root: false
  attributes :id, :code, :name
end