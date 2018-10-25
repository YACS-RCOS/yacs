import requests
from  globals import API_URL

def gallatin_data(query_string):
	# This function takes in a query string
	# and returns the JSON data that the API returns for that query string
  
  #getting json file from gallatin
  r = requests.get(API_URL + query_string)

  #returning json data
  return r.text.strip()
