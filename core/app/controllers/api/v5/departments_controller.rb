class Api::V5::DepartmentsController < Api::V5::ApiController
  def index
    filter_model Department
    filter_any :id, :school_id, :name, :code
    if @show_courses
      query.includes! :courses
      query.includes! courses: [:sections] if @show_sections
    end
  end

  def show
    @query = Department.where(id: params[:id])
  end

  def create
    @query = [Department.create!(department_params)]
    render action: :show, status: :created
  end

  def update
    @query = [Department.find(params[:id])]
    @query.first.update!(department_params)
    render action: :show, status: :success
  end

  def destroy
    Department.find(params[:id]).destroy!
    head :no_content
  end

  private

  def department_params
    params.require(:department).permit(:code, :name, :school_id)
  end 
end
