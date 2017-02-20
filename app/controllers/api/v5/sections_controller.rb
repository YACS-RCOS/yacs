class Api::V5::SectionsController < Api::V5::ApiController
  def index
    filter_model Section
    filter_any :id, :course_id, :name, :crn
  end
  def update
  	# # puts params
  	Section.find(params[:id]).update(seats_taken: params[:seats_taken])
  	render :action => :index
  end
end