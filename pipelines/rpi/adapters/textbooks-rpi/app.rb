require 'sinatra'
require 'sinatra/json'
require 'oj'
require_relative 'textbook_client'
require_relative 'efollet_client'

set :bind, '0.0.0.0'
set :port, 4600
enable :lock

efollet_bookstore_id = ENV['EFOLLET_BOOKSTORE_ID'] || 1461
$efollet_client = EfolletClient.new efollet_bookstore_id
$textbook_clients = {}

def client_for term_shortname
	$textbook_clients[term_shortname] ||= TextbookClient.new($efollet_client, term_shortname)
end

get "/:term_shortname" do
  json client_for(params[:term_shortname]).listings_by_subject_with_textbooks
end
