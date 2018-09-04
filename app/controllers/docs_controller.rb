require 'jsonapi_swagger_helpers'

class DocsController < ActionController::API
  include JsonapiSwaggerHelpers::DocsControllerMixin

  swagger_root do
    key :swagger, '2.0'
    info do
      key :version, '0.12.0'
      key :title, 'Yacs'
      key :description, '--'
      contact do
        key :name, 'Ada Young'
        key :email, 'ada@adadoes.io'
      end
    end
    key :basePath, '/api'
    key :consumes, ['application/json']
    key :produces, ['application/json']
  end

  jsonapi_resource '/v6/terms'
  jsonapi_resource '/v6/schools'
  jsonapi_resource '/v6/subjects'
  jsonapi_resource '/v6/courses'
  jsonapi_resource '/v6/listings'
  jsonapi_resource '/v6/sections'
  jsonapi_resource '/v6/instructors'
end
