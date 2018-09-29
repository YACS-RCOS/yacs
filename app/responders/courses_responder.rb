class CoursesResponder < ApplicationResponder
  @@topic_name = "#{ENV['UNI_SHORTNAME']}.final_records"

  topic @@topic_name, required: true

  def respond(event)
    respond_to @@topic_name, event.to_json(:only => [:uuid,:department_id, :name, :number, :min_credits, :max_credits, :created_at , :updated_at, :description, :tags])
  end
end
