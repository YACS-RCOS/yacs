module Api
  module V5
    class DepartmentsController < ApplicationController
      def index
        @departments = Department.all
      end

      def show
        @department = Department.find(params[:id])
      end
    end
  end
end