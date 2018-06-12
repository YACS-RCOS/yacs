class CoursesResponder < ApplicationResponder
  @@topic_name = ENV['COURSES_TOPIC_NAME'].to_sym

  topic @@topic_name, required: true

  def respond(event)
    respond_to :"#{@@topic_name}", event.to_json(:only => [:uuid,:department_id, :name, :number, :min_credits, :max_credits, :created_at , :updated_at, :description, :tags])
  end
end