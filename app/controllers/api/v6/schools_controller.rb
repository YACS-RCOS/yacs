class Api::V6::SchoolsController < Api::V6::ApiController
  def create
    @query = [School.create!(school_params)]
  end

  def show
    @query = School.where(id: params[:id])
  end

  def update
    @query = [School.find(params[:id])]
    @query.first.update!(school_params)
  end

  def destroy
    School.find(params[:id]).destroy!
  end

  private

  def school_params
    params.require(:school).permit(:longname)
  end
end
