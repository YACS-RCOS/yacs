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
  def create
    School.create!(school_params)
    head :no_content
  end

  def update
  	School.find(params[:id]).update!(school_params)
  	head :no_content
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