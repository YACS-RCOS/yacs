require 'sinatra'
require 'sinatra/json'
require 'oj'
require_relative 'albert_client'
require 'pry'


set :bind, '0.0.0.0'
set :port, 4600

$albert_client = AlbertClient.new

def pps data
	"<pre>#{JSON.pretty_generate(data)}</pre>"
end

get "/:term_shortname" do
	if params[:term_shortname] == "favicon.ico"
		return pps Hash.new
	end
	school_shortname = 'UA'
	subject_shortname = 'AHSEM-UA'
	pps $albert_client.query_albert(params[:term_shortname], school_shortname, subject_shortname)
end

get "/metadata/terms" do
	pps $albert_client.terms
end

get "/metadata/schools" do
	pps $albert_client.schools
end

get "/metadata/subjects/:school_shortname" do
	pps nil
end
