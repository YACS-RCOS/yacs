module EventResponders

    class CourseResponder < ApplicationResponder
       topic :course_changee

        def respond(event)
            respond_to :course_change, event.to_json(:only => [:uuid,:department_id, :name, :number, :min_credits, :max_credits, :created_at , :updated_at, :description, :tags  ])
        end
    end

    class SectionResponder < ApplicationResponder
       topic :section_change

       def respond(event)
           respond_to :section_change , event.to_json(:only => [:uuid,:course_id, :name, :crn, :seats, :seats, :seats_taken, :created_at, :updated_at, :num_periods, :instructors, :conflicts ])
       end
    end

end
