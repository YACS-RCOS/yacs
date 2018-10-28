import requests
from globals import API_URL
import os

dirname = None
datadir = None

def get_datadir():
	global dirname,datadir
	if dirname is None:
		dirname = os.path.dirname(os.path.abspath(__file__))
	if datadir is None:
		datadir = os.path.join(dirname,"data")
	return datadir


def get_data(filename = 'data.json'):
	with open(os.path.join(get_datadir(),filename),"r") as f:
		txt = f.read()
	return txt

def fetch_data(query, filename = "data.json"):
	datadir = get_datadir()
	try:
		os.mkdir(datadir)
	except:
		pass

	r = requests.get(API_URL+'?'+query)
	if filename is not None:
		with open(os.path.join(datadir,filename),"w") as f:
			f.write(r.text)
	return r.text
