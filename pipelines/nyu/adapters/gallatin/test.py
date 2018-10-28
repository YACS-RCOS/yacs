import requests # Python Packages
import os
import sys
import warnings

# Test script to make sure that everything is running according to plan

# Setting useful Global vars
SERVER_URL = '127.0.0.1'
PORT = 8080
INDEX = ''
JST = 'jsontrans.py'
e = exec

# Useful Utility Functions

# Send a request to the server and print it
def try_connect():
	r = requests.get("{}:{}/{}".format(SERVER_URL,PORT,INDEX))
	print(r.text)

# Get test data as if you had connected to the Gallatin API
def get_test_data():
	return r('data/data.json')

def r(filename):
	with open(filename,"r") as f:
		txt = f.read()
	return txt

# Getting/setting path vars
try:
	path = os.path.abspath(__file__) # Run the first time using python -i test.py
except:
	pass # if __file__ is undefined, then the script is being run in interpreter -
	# 'path' should already be defined then
dirname = os.path.dirname(path)
sys.path.append(os.path.join(dirname,'src'))

# Getting Cython to chill out
warnings.filterwarnings("ignore", message="numpy.dtype size changed")
warnings.filterwarnings("ignore", message="numpy.ufunc size changed")

# importing resources from local modules in file system
from apitrans import get_query
from galreq import gallatin_data
from globals import *
from jsontrans import format_data
from main import run

print('test.py was run successfully')
