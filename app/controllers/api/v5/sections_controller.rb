class Api::V5::SectionsController < Api::V5::ApiController
  def index
    if params[:course_id].present?
      @sections = Section.where(course_id: params[:course_id])
    else
      @sections = Section.all
    end
  end

  def show
    @section = Section.find(params[:id])
  end
end