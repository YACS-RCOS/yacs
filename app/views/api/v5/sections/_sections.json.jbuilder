json.sections sections do |section|
  json.(section, :id, :name, :crn, :seats, :seats_taken)
  json.seats_available section.seats - section.seats_taken
  json.instructors section.instructors.join(', ')
  json.periods do
    i = 0
    json.array! section.periods_type do |type|
      json.type section.periods_type[i]
      json.day section.periods_day[i]
      json.start section.periods_start[i]
      json.end section.periods_end[i]
      i += 1
    end
  end
end