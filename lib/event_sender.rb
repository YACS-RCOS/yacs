class EventSender

  def self.send_course_event(obj, field)
    tempHash = {"id"=> obj.id, "name"=>obj.name, "number"=>obj.number,"update" => {"fieldname"=>field,},}
    Redis.current.publish("channel",tempHash.to_json)
  end

  def self.send_section_event(obj, fieldtype)
    tempHash = {"id" => obj.course.id, "name" => obj.course.name, "number" => obj.course.number,"update" => {
      "seats"=> obj.seats, "seats_taken"=>obj.seats_taken,"section"=>
        {"name" => obj.name, "crn" => obj.crn},},}
    if fieldtype == :section_added or fieldtype == :section_removed
      tempHash["update"]["field_name"] = fieldtype
      Redis.current.publish("channel",tempHash.to_json)
    else
      if obj.seats_changed?
        tempHash["before"] = :seats_was
        if obj.seats_was > obj.seats
          tempHash["update"]["field_name"] = :seats_removed
        else 
          tempHash["update"]["field_name"]= :seats_added
        end
        Redis.current.publish("channel",tempHash.to_json)
        if obj.seats_taken >= obj.seats_was and obj.seats_taken < obj.seats
          tempHash["update"]["field_name"] = :section_opened
        elsif obj.seats_taken < obj.seats_was and obj.seats_taken >= obj.seats
          tempHash["update"]["field_name"] = :section_closed
        end
        Redis.current.publish("channel",tempHash.to_json)
      elsif obj.seats_taken_changed?
        tempHash["before"] = :seats_taken_was
        if obj.seats_taken_was >= obj.seats and obj.seats_taken < obj.seats
          tempHash["update"]["field_name"] = :section_opened
        elsif obj.seats_taken_was < obj.seats and obj.seats_taken >= obj.seats
          tempHash["update"]["field_name"] = :section_closed
        end
        Redis.current.publish("channel",tempHash.to_json)
      end
    end
  end 
end
