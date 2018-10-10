class Api::V5::SchoolsController < Api::V5::ApiController
  def index
    filter_model School
    filter_any :id, :name
    if @show_departments
      query.includes! :departments
      query.includes! departments: [:courses] if @show_courses
    end
    query.order! :id
  end

  def show
    @query = School.where(id: params[:id])
  end

  def create
    @query = [School.create!(school_params)]
    render action: :show, status: :created
  end

  def update
    @query = [School.find(params[:id])]
    @query.first.update!(school_params)
    render action: :show, status: :success
  end

  def destroy
    School.find(params[:id]).destroy!
    head :no_content
  end

  private

  def school_params
  	params.require(:school).permit(:name)
  end
end
