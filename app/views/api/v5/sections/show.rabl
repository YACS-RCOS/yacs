object @section
attributes :id, :name, :crn, :course_id, :seats, :seats_taken
node(:periods => @section.periods) do
  attributes :id, :time, :period_type, :location
end