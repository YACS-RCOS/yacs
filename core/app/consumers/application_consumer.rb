class Consumers
  def self.consumer_for _term_shortname
    dynamic_name = "ApplicationConsumer#{_term_shortname}"
    Object.const_set(dynamic_name, Class.new(ApplicationConsumer))
    eval("#{dynamic_name}")
  end
end

class ApplicationConsumer < Karafka::BaseConsumer
  ALLOWED_TYPES = %w(school subject listing section).freeze
  ALLOWED_METHODS = %w(create update delete).freeze
  ALLOWED_PARAMS = {
    school: %i(longname uuid),
    # department: %i(shortname, longname, uuid, school_uuid)
    subject: %i(shortname longname uuid school_uuid),
    listing: %i(shortname longname description min_credits max_credits uuid subject_uuid subject_shortname) <<
      { required_textbooks: [], recommended_textbooks: [], tags: [] },
    section: %i(shortname crn seats seats_taken uuid listing_uuid) <<
      { instructors: [], periods: %i(day start end type location) }
  }.with_indifferent_access.freeze

  include Karafka::Consumers::Callbacks

  after_fetch do
    @type = params['type']
    @method = params['method']
    unless ALLOWED_TYPES.include? @type
      STDERR.puts params
      throw "ERROR: Disallowed Type: #{@type}"
    end
    unless ALLOWED_METHODS.include? @method
      throw "ERROR: Disallowed Method: #{@method}"
    end
    @data = safe_params
  end

  def consume
    begin
      send "transform_#{@type}"
      send "consume_#{@type}"
    rescue Exception => e
      File.open('errors.txt', 'a+b') do |file|
        file.puts({ error: e, params: params }.to_json)
      end
      # raise e
    end
  end

  protected

  # def consume_create
  #   @type.capitalize.constantize.create! @data
  # end

  # def consume_update
  #   record = @type.capitalize.constantize.find_by! uuid: @data[:uuid]
  #   record.update! @data
  # end

  # def consume_delete
  #   record = @type.capitalize.constantize.find_by! uuid: @data[:uuid]
  #   record.destroy!
  # end

  def consume_school
    school = School.find_by uuid: @data[:uuid]
    school.present? ? school.update!(@data) : School.create!(@data)
  end

  def consume_subject
    subject = Subject.find_by uuid: @data[:uuid]
    subject.present? ? subject.update!(@data) : Subject.create!(@data)
  end

  def consume_listing
    listing = Listing.find_by uuid: @data[:uuid]
    listing ||= Listing.find_by(term_id: @data[:term_id], course_id: @data[:course_id])
    listing.present? ? listing.update!(@data) : Listing.create!(@data)
  end

  def consume_section
    section = Section.find_by uuid: @data[:uuid]
    section.present? ? section.update!(@data) : Section.create!(@data)
  end

  private

  def safe_params
    safe_params = ActionController::Parameters.new params
    safe_params.require(@type).permit(*ALLOWED_PARAMS[@type])
  end

  def term_shortname
    # self.class.name.match(/\d{6}/)[0]
    topic.consumer_group.name
  end

  def transform_school
  end

  def transform_subject
    @data[:school_id] = School.find_by!(uuid: @data[:school_uuid]).id
    @data.delete :school_uuid
  end

  def transform_listing
    subject = Subject.find_by!(shortname: @data[:subject_shortname]).id
    course = Course.where(subject: subject, shortname: @data[:shortname]).first_or_create
    @data[:course_id] = course.id
    @data[:term_id] = Term.find_by(shortname: term_shortname).id
    @data.delete :subject_uuid
    @data.delete :shortname
    @data.delete :subject_shortname
  end

  def transform_section
    @data[:listing_id] = Listing.find_by!(uuid: @data[:listing_uuid]).id
    @data.delete :listing_uuid
    # @data.merge! Section.periods_hash_to_array @data[:periods]
    # @data.delete :listing_uuid
    # @data.delete :periods
  end
end
