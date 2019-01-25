require 'sinatra'
require 'sinatra/json'
require 'oj'
require_relative 'src/albert_client'
require 'pry'

set :bind, '0.0.0.0'
set :port, 4600

$albert_client = AlbertClient.new

def pps data
	"<pre>#{JSON.pretty_generate(data)}</pre>"
end

def get_data(term, school, subject)
	$albert_client.schools term
end

def parse_term_shortname term_shortname
	term_shortname
end

get_data 1194, 'UA', 'AHSEM-UA'

# quit
get("/favicon.ico") { pps Hash.new }

get "/:term_shortname" do
	pps get_data(params[:term_shortname], 'UA', 'AHSEM-UA')
end

get "/metadata/:keyword" do
	pps $albert_client.send(params[:keyword])
end

get "/metadata/subjects/:school_shortname" do
	pps nil
end

get "/test/:test_data" do
	term, school, subject = params[:test_data].split(',')
	get_data(term, school, subject)
end
