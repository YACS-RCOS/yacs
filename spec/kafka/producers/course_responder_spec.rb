require "rails_helper"

RSpec.describe EventResponders::CoureseResponder do
    subject(:responder) {described_class.new}

    context 'produce message for topic' do

        describe 'topics to speak to' do
            let(:topic) { described_class.topics['course_change'] }
            it { expect(topic.name).to eq 'course_change' }
            #(...)
        end

        describe '.call' do
            let(:input_data) { { rand => rand } }
            let(:accumulated_data) do
                [[input_data.to_json, { topic: 'section_change'}]]
            end
        end
    end

    context '...' do
    end

    context '...' do
    end

end
