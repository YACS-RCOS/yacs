class Api::V6::ListingsController < Api::V6::ApiController
  def index
    listings = ListingResource.all(params)
    respond_with(listings)
  end

  def show
    listing = ListingResource.find(params)
    respond_with(listing)
  end

  def create
    listing = ListingResource.build(params)

    if listing.save
      render jsonapi: listing, status: 201
    else
      render jsonapi_errors: listing
    end
  end

  def update
    listing = ListingResource.find(params)

    if listing.update_attributes
      render jsonapi: listing
    else
      render jsonapi_errors: listing
    end
  end

  def destroy
    listing = ListingResource.find(params)

    if listing.destroy
      render jsonapi: { meta: {} }, status: 200
    else
      render jsonapi_errors: listing
    end
  end
end
