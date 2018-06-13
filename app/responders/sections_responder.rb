class SectionsResponder < ApplicationResponder
  @@topic_name = ENV['SECTIONS_TOPIC_NAME'].to_sym

  topic @@topic_name, required: true

  def respond(event)
    respond_to @@topic_name, event.to_json(:only => [:uuid,:course_id, :name, :crn, :seats, :seats, :seats_taken, :created_at, :updated_at, :num_periods, :instructors, :conflicts])
  end
end

