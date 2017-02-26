class Api::V5::SectionsController < Api::V5::ApiController
  def index
    filter_model Section
    filter_any :id, :course_id, :name, :crn
  end
  def update
  	# # puts params
  	#Section.find(params[:id]).update(seats_taken: params[:seats_taken])
    Section.find(params[:id]).tap{ |section| section.update!(section_params)}
  	render :action => :index
  end
  private 

    def section_params
      #binding.pry
      params.require(:section).permit(:name, :crn, :seats, :seats_taken, 
        :instructors, :num_periods, :course_id)
    end 
end