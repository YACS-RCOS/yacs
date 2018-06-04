class CoreResponder < ApplicationResponder
    #ALLOWED_TYPES = %w(school department course section).freeze

   topic :course_change
   topic :section_change

    def respond(event)
       respond_to :section_change , event.to_json(:only => [:uuid,:course_id, :name, :crn, :seats, :seats, :seats_taken, :created_at, :updated_at, :num_periods, :instructors, :conflicts ])
       respond_to :course_change, event.to_json(:only => [:uuid,:department_id, :name, :number, :min_credits, :max_credits, :created_at , :updated_at, :description, :tags  ])
    end
end
