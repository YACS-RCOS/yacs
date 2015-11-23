child(@courses => :courses) do
  collection @courses, root: :courses, object_root: false
  attributes :id, :name, :number, :min_credits, :max_credits
  node :credits do |c|
    c.min_credits == c.max_credits ? c.min_credits : "#{c.min_credits}-#{c.max_credits}"
  end
  child(:department) do
    attributes :id, :name
    node :codename do |d|
      d.code
    end
  end
  child(:sections => :course_sections) do
    collection :sections, root: :course_sections, object_root: false
    attributes :id, :name, :crn, :seats, :seats_taken
  end
end
