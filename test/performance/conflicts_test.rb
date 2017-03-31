require 'test_helper'
require 'rails/performance_test_help'

class ConflictsTest < ActionDispatch::PerformanceTest
  # Refer to the documentation for all available options
  self.profile_options = { runs: 5, metrics: [:process_time],
                           output: 'tmp/performance', formats: [:graph_html] }

  def setup
    @section1 = FactoryGirl.create(:section_with_periods)
    @section1.update_column(:conflicts, [*1..10000])
    @section2 = FactoryGirl.build(:section_with_periods, id: 10001)
  end

  %w(periods_check array_include array_bsearch_spaceship array_bsearch_subtract).each do |t|
    test "conflicts_with_#{t}" do
      # puts 'test'
      10000.times do
        @section1.send("conflicts_with_#{t}", @section2)
      end
    end
  end

  # test 'conflicts_with_slow' do
  #   @section1.conflicts_with_slow @section2
  # end
end
