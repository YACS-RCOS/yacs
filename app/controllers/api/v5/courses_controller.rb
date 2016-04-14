class Api::V5::CoursesController < Api::V5::ApiController
  caches_action :index, if: Proc.new { |c| c.request.format.xml? && c.params[:department_id].present? },
    cache_path: Proc.new { |c| "api/v5/courses/index.xml?department_id=#{c.params[:department_id]}" }
    
  def index
    filter_model Course
    filter :search do 
      Course.search params[:search].gsub(/[^0-9a-z\s]/i, '').split
    end
    filter :section_id do |q|
      q.joins(:sections).where :"sections.id" => any :section_id
    end
    filter :department_code do |q|
      q.joins(:department).where :"departments.code" => any :department_code
    end
    filter_any :id, :department_id
  end
end