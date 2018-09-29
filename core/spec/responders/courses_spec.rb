require "rails_helper"

RSpec.describe CoursesResponder do
  subject(:responder) {described_class.new}
  let(:event) { Course.self }
  let(:topic_var) { ENV["COURSES_TOPIC_NAME"]}
  context 'produce message for topic' do
    it { expect(described_class.topcis.size).to eq 1 }
    describe 'topic(s) to speak to' do
      let(:topic) { described_class.topics[topic_var] }
      it { expect(topic.name).to eq topic_var }
    end
        
    describe '#call' do
      let(:input_data) { { rand => rand } }
      let(:accumulated_data) do
        [[event.to_json, { topic: topic_var }]]
      end

      it 'expect to add builds to message buffer' do
        responder.call(event)
        expect(responder.messages_buffer[topic_var]).to eq accumulated_data
      end
    end
  end
end
