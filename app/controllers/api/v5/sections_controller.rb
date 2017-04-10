class Api::V5::SectionsController < Api::V5::ApiController
  def index
    filter_model Section
    filter_any :id, :course_id, :name, :crn
  end

  def show
    @query = Section.where(id: params[:id])
  end

  def create
    Section.create!(section_params)
    head :no_content
  end

  def update
    Section.find(params[:id]).update!(section_params)
    head :no_content
  end

  def destroy
    Section.find(params[:id]).destroy!
    head :no_content
  end

  private 
  def section_params
    params.require(:section).permit(:name, :crn, :seats, :seats_taken, 
      :instructors, :num_periods, :course_id)
  end 
end