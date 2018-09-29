class Api::V6::TermsController < Api::V6::ApiController
  def index
    terms = TermResource.all(params)
    respond_with(terms)
  end

  def show
    term = TermResource.find(params)
    respond_with(term)
  end

  def create
    term = TermResource.build(params)

    if term.save
      render jsonapi: term, status: 201
    else
      render jsonapi_errors: term
    end
  end

  def update
    term = TermResource.find(params)

    if term.update_attributes
      render jsonapi: term
    else
      render jsonapi_errors: term
    end
  end

  def destroy
    term = TermResource.find(params)

    if term.destroy
      render jsonapi: { meta: {} }, status: 200
    else
      render jsonapi_errors: term
    end
  end
end
