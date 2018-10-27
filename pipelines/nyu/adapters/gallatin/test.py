import requests
import os
from apitrans import get_query
from galreq import gallatin_data
from globals import *

SERVER_URL = '127.0.0.1'
PORT = 8080
PATH = ''
JST = 'jsontrans.py'
e = exec

# Test script to make sure that everything is running according to plan

# Send a request to the server and print it
def try_connect():
	r = requests.get("{}:{}/{}".format(SERVER_URL,PORT,PATH))
	print(r.text)

# Get test data as if you had connected to the Gallatin API
def get_test_data():
	return r('data/data.json')

def r(filename):
	with open(filename,"r") as f:
		txt = f.read()
	return txt

os.chdir('src')

print('test.py was run successfully')
