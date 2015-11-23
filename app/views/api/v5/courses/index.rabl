child(@courses => :courses) do
  collection @courses, root: :courses, object_root: false
  attributes :id, :name, :number, :min_credits, :max_credits
  child(:department) do
    attributes :id, :name
    node :codename do |dept|
      dept.code
    end
  end
  child(:sections => :course_sections) do
    collection :sections, root: :course_sections, object_root: false
    attributes :id, :name, :crn, :seats, :seats_taken
  end
end
