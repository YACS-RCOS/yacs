class SectionResponder < ApplicationResponder
   topic :section_change, required: true

   def respond(event)
       respond_to :section_change , event.to_json(:only => [:uuid,:course_id, :name, :crn, :seats, :seats, :seats_taken, :created_at, :updated_at, :num_periods, :instructors, :conflicts ])
   end
end

