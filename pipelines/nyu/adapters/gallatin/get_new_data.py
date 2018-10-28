import requests
from globals import API_URL
import os

QUERY = "?limit=1"

def get_data(filename = 'data/data.json'):
	with open(filename,"r") as f:
		txt = f.read()
	return txt

def fetch_data(query, filename = "data.json"):
	global path,datadir
	try:
		path = os.path.dirname(os.path.abspath(__file__))
		datadir = os.path.join(path,"data")
		os.mkdir(datadir)
	except:
		pass

	r = requests.get(API_URL+query)
	if filename is not None:
		with open(os.path.join(datadir,filename),"w") as f:
			f.write(r.text)
	return r.text
