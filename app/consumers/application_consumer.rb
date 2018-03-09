class ApplicationConsumer < Karafka::BaseController
  ALLOWED_TYPES = %w(school department course section).freeze
  ALLOWED_METHODS = %w(create update delete).freeze
  ALLOWED_PARAMS = {
    school: %i(name uuid),
    department: %i(name code uuid school_uuid),
    course: %i(name number description min_credits max_credits uuid department_uuid),
    section: %i(name crn seats seats_taken uuid course_uuid) << { periods: %i(day start end type location) }
  }.with_indifferent_access.freeze

  include Karafka::Controllers::Callbacks

  after_fetched do
    @type = params[:type]
    @method = params[:method]
    unless ALLOWED_TYPES.include? @type
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
      send "consume_#{@method}"
    rescue Exception => e
      File.open('errors.txt', 'a+b') do |file|
        file.puts({ error: e, params: params }.to_json)
      end
    end
  end

  protected

  def consume_create
    @type.capitalize.constantize.create! @data
  end

  def consume_update
    record = @type.capitalize.constantize.find_by! uuid: @data[:uuid]
    record.update! @data
  end

  def consume_delete
    record = @type.capitalize.constantize.find_by! uuid: @data[:uuid]
    record.destroy!
  end

  private

  def safe_params
    safe_params = ActionController::Parameters.new params
    safe_params.require(@type).permit(*ALLOWED_PARAMS[@type])
  end

  def transform_school
  end

  def transform_department
    @data[:school_id] = School.find_by!(uuid: @data[:school_uuid]).id
    @data.delete :school_uuid
  end

  def transform_course
    @data[:department_id] = Department.find_by!(uuid: @data[:department_uuid]).id
    @data.delete :department_uuid
  end

  def transform_section
    @data[:course_id] = Course.find_by!(uuid: @data[:course_uuid]).id
    @data.merge! Section.periods_hash_to_array @data[:periods]
    @data.delete :course_uuid
    @data.delete :periods
  end
end
