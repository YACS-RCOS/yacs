class Api::V5::CoursesController < Api::V5::ApiController
  caches_action :index, if: Proc.new { |c| c.request.format.xml? && c.params[:department_id].present? },
    cache_path: Proc.new { |c| "api/v5/courses/index.xml?department_id=#{c.params[:department_id]}" }

  def index
    if params[:department_id].present?
      @courses = Course.where department_id: params[:department_id].split(',')
    elsif params[:id].present?
      @courses = Course.find params[:id].split(',')
    elsif params[:section_id].present?
      ids = params[:section_id]
      @courses = Course.distinct.joins(:sections).where "sections.id = ANY (ARRAY[#{ids}])"
    elsif params[:search].present?
      @courses = Course.search params[:search].gsub(/[^0-9a-z\s]/i, '').split
    else
      @courses = Course.all
    end
    respond_to do |format|
      format.xml { render xml: @courses }
      format.json { render }
    end
  end
end