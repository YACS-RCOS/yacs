child(@courses => :courses) do
  collection @courses, root: :courses, object_root: false
  attributes :id, :name, :number, :min_credits, :max_credits
  child(:department) do
    attributes :id, :code
  end
end
