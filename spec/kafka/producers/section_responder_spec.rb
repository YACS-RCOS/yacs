require "rails_helper"

RSpec.describe SectionResponder do
    subject(:responder) {described_class.new}

    context 'produce message for topic' do

        describe 'topics to speak to' do
            let(:topic) { described_class.topics['section_chage'] }
            it { expect(topic.name).to eq 'section_change' }
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
