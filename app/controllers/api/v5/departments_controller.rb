module Api
  module V5
    class DepartmentsController < ApplicationController
      def index
        @departments = Department.all
      end
    end
  end
end