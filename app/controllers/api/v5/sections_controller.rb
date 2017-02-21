class Api::V5::SectionsController < Api::V5::ApiController
  def index
    filter_model Section
    filter_any :id, :course_id, :name, :crn
  end

  def new

  end

  def create

  end
  
end