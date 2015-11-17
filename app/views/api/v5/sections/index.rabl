collection @sections, root: :sections, object_root: false
attributes :id, :name, :crn, :course_id, :seats, :seats_taken
child(:periods, object_root: false) do
  attributes :id, :time, :period_type, :location
end