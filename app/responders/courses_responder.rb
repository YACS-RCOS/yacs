class CoursesResponder < ApplicationResponder
  @@courses_topic_name = ENV['COURSES_TOPIC_NAME']

  topic :"#{@@courses_topic_name}", required: true

  def respond(event)
    respond_to :"#{@@courses_topic_name}", event.to_json(:only => [:uuid,:department_id, :name, :number, :min_credits, :max_credits, :created_at , :updated_at, :description, :tags])
  end
end