require 'json-diff'

class ChangeEventGenerator

  # Creates a new ChangeEventGenerator
  #
  # @param [Hash<String, Array<Hash>>] before the earlier data from the source
  # @param [Hash<String, Array<Hash>>] after the later data from the source
  def initialize before, after
    @before = before
    @after = after
  end

  def create_change_from_json_patch

  end
end
