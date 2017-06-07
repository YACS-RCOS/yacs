class EventSender
	def self.send_event(obj, fieldname, before=0, after=0)
		tempHash = {"event_type" => "event_type", "data" => {"update" => {"fieldname"=>"#{fieldname}","before" => "#{before}",
	          "after" =>  "#{after}","section"=>{},},},}
	    if obj.instance_of?(Course)
	    	tempHash["data"]["id"] = "#{obj.id}"
	    	tempHash["data"]["name"] = "#{obj.name}"
	    	tempHash["data"]["number"] = "#{obj.number}"
	    elsif obj.instance_of?(Section)
	    	tempHash["data"]["id"] = "#{obj.course.id}"
	    	tempHash["data"]["name"] = "#{obj.course.name}"
	    	tempHash["data"]["number"] = "#{obj.course.number}" 
	    	tempHash["data"]["update"]["section"]["name"] = "#{obj.name}"
	    	tempHash["data"]["update"]["section"]["crn"] = "#{obj.crn}"
	    end
	    Redis.current.publish("channel",tempHash.to_json)
	end

end