import requests # Python Packages
import os
import sys
import warnings

# Test script to make sure that everything is running according to plan

# Getting/setting path vars
try:
	path = os.path.abspath(__file__) # Run the first time using python -i test.py
except:
	pass # if __file__ is undefined, then the script is being run in interpreter -
	# 'path' should already be defined then
dirname = os.path.dirname(path)
src = os.path.join(dirname,'src')
sys.path.append(src)

# Setting convenience Global vars
jst = os.path.join(src,'jsontrans.py') # shorthand for jsontrans module

# Setting useful Global vars
SERVER_URL = '127.0.0.1'
PORT = 8080
INDEX = ''
e = exec

# Useful Utility Functions

# Send a request to the server and print it
def try_connect():
	r = requests.get("{}:{}/{}".format(SERVER_URL,PORT,INDEX))
	print(r.text)

def r(filename):
	with open(filename,"r") as f:
		txt = f.read()
	return txt

# Getting Cython to chill out
warnings.filterwarnings("ignore", message="numpy.dtype size changed")
warnings.filterwarnings("ignore", message="numpy.ufunc size changed")

# importing resources from local modules in file system
from apitrans import get_query
from galreq import gallatin_data
from globals import *
from jsontrans import format_data
from main import run
from get_new_data import get_data,fetch_data

print('test.py was run successfully')
