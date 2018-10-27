import requests
from globals import API_URL
import os

QUERY = "?limit=1"
filename = "data.json"

filedir = os.path.dirname(os.path.abspath(__file__))
datadir = os.path.join(filedir,"data")
try:
	os.mkdir(datadir)
except:
	pass

r = requests.get(API_URL+QUERY)
with open(os.path.join(datadir,filename),"w") as f:
	f.write(r.text)
