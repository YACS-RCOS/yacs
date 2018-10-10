class Api::V6::SectionsController < Api::V6::ApiController
  def index
    sections = SectionResource.all(params)
    respond_with(sections)
  end

  def show
    section = SectionResource.find(params)
    respond_with(section)
  end

  def create
    section = SectionResource.build(params)

    if section.save
      render jsonapi: section, status: 201
    else
      render jsonapi_errors: section
    end
  end

  def update
    section = SectionResource.find(params)

    if section.update_attributes
      render jsonapi: section
    else
      render jsonapi_errors: section
    end
  end

  def destroy
    section = SectionResource.find(params)

    if section.destroy
      render jsonapi: { meta: {} }, status: 200
    else
      render jsonapi_errors: section
    end
  end
end
