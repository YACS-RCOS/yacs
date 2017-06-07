require "rails_helper"

RSpec.describe Section do
  context 'when a section is updated' do
    context 'when period information is updated' do
      before do
        @section = create(:section, num_periods: 5, 
          periods_day: [3, 5, 2, 2, 4], 
          periods_start: [1200, 800, 1600, 800, 800], 
          periods_end: [1400, 900, 1800, 900, 1000], 
          periods_type: ['LAB', 'LEC', 'TEST', 'LEC', 'LEC'])
      end

      it 'sorts periods by day, and then start time' do 
        expect(@section.num_periods).to eq 5
        expect(@section.periods_day).to eq [2, 2, 3, 4, 5]
        expect(@section.periods_start).to eq [800, 1600, 1200, 800, 800]
        expect(@section.periods_end).to eq [900, 1800, 1400, 1000, 900]
        expect(@section.periods_type).to eq ['LEC', 'TEST', 'LAB', 'LEC', 'LEC']
      end
    end

    context 'when non-period information is updated' do
      before do
        Section.skip_callback(:save, :before, :sort_periods, if: :periods_changed?)
        @section = create(:section, num_periods: 5, 
          periods_day: [3, 5, 2, 2, 4], 
          periods_start: [1200, 800, 1600, 800, 800], 
          periods_end: [1400, 900, 1800, 900, 1000], 
          periods_type: ['LAB', 'LEC', 'TEST', 'LEC', 'LEC'])
        Section.set_callback(:save, :before, :sort_periods, if: :periods_changed?)
        @section.update(instructors: ['>:-]', ':-)', ':-|', ':-(', '>:-['])
      end

      it 'does not sort period' do 
        expect(@section.num_periods).to eq 5
        expect(@section.periods_day).to eq [3, 5, 2, 2, 4]
        expect(@section.periods_start).to eq [1200, 800, 1600, 800, 800]
        expect(@section.periods_end).to eq [1400, 900, 1800, 900, 1000]
        expect(@section.periods_type).to eq ['LAB', 'LEC', 'TEST', 'LEC', 'LEC']
      end
    end
  end

  context 'when sections are created' do
    before do
      @section = create(:section)
    end

    it 'sends a section_added event' do
      file = mock('file')
      @buffer = StringIO.new()
      @filename = 'test.json'
      allow(File).to receive(:open).with(@filename, 'w').and_yield(@buffer)

      parsed = JSON.parse(@buffer.string)
      expect(parsed['data']['name']).to eq 'section_added'
    end
  end

  context 'when sections are removed' do
    before do
      @section = create(:section)
      @section.destroy
    end

    it 'sends a section_removed event' do

    end
  end

  context 'when section seats are added' do
    context 'when section opens due to seats add' do
      before do
        @section = create(:section, seats: 150, seats_taken: 160)
        @section.update(seats: 165)
      end

      it 'sends a seats_added_section_opened event' do

      end
    end

    context 'when seats add does not open a section' do
      before do
        @section = create(:section, seats: 50, seats_taken: 30)
        @section.update(seats: 60)
      end

      it 'sends a seats_added event' do

      end
    end
  end

  context 'when section seats are removed' do
    context 'when section closes due to seats remove' do
      before do
        @section = create(:section, seats: 250, seats_taken: 240)
        @section.update(seats: 200)
      end

      it 'sends a seats_removed_section_closed event' do

      end
    end

    context 'when seats remove does not close a section' do
      before do
        @section = create(:section, seats: 100, seats_taken: 70)
        @section.update(seats: 90)
      end

      it 'sends a seats_removed event' do

      end
    end
  end

  context 'when section is opened' do
    before do
      @section = create(:section, seats: 100, seats_taken: 100)
      @section.update(seats_taken: 99)
    end

    it 'sends a sectionopened event' do

    end
  end

  context 'when section is closed' do
    before do
      @section = create(:section, seats: 200, seats_taken: 199)
      @section.update(seats_taken: 200)
    end

    it 'sends a secionclosed event' do

    end
  end
end