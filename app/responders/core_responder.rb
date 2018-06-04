# frozen_string_literal

# GoaL:Send a new Kafka message to topic(s), whenever an ActiveRecord object is changes state.
#
# Steps:(high level logic)
#   1. Wait for a message from yacs-malg for change in state of an object.(Active Callback will be needed. What is the format of the data received?)
#   2. If object changes state, then create a message in the format of [:uuid, :record]
#   3. Using Kafka Responder methods to send data to topic
#       Conditions:
#           + Wha
#
#  TO DO:
#   - implement file below
#   - find out whether I need to create the topic as well
#   - add tests to logic
#
#   Note: ensure each object type has it's own topic
#         look into Active::Record::Serialization
#
#   Questions to answer:
#      1. How will I be able to receive updates from the ActiveRecords ?
#          - By using the
#      2. What format is the current data input for the responder?
#
#      3. Where in this application is the whole entire record of data?
#
#      4. What conditions do we need to consider?

#require 'json'

class CoreResponder < ApplicationResponder
    #ALLOWED_TYPES = %w(school department course section).freeze

   topic :course_change
   topic :section_change

    def respond(event)
       respond_to :section_change , event.to_json(:only => [:uuid,:course_id, :name, :crn, :seats, :seats, :seats_taken, :created_at, :updated_at, :num_periods, :instructors, :conflicts ])
       respond_to :course_change, event.to_json(:only => [:uuid,:department_id, :name, :number, :min_credits, :max_credits, :created_at , :updated_at, :description, :tags  ])
    end
end
