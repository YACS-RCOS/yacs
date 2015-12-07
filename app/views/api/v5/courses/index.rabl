child(@courses => :courses) do
  collection @courses, root: :courses, object_root: false
  attributes :id, :name, :number, :credits
  node :credits do |c|
    c.min_credits == c.max_credits ? "#{c.min_credits} credits" : "#{c.min_credits}-#{c.max_credits} credits"
  end
  node :dept_code do |c|
  #  attributes :id, :name
    c.department.code
  end
  child(:sections => :course_sections) do
    collection :sections, root: :course_sections, object_root: false
    attributes :id, :name, :crn, :seats, :seats_taken
  end
end
