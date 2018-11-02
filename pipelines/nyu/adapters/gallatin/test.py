import requests # Python Packages
import os
import sys
import warnings
from importlib import reload

# Getting Cython to chill out
warnings.filterwarnings("ignore", message="numpy.dtype size changed")
warnings.filterwarnings("ignore", message="numpy.ufunc size changed")

import pandas as pd

# Test script to make sure that everything is running according to plan

# Getting/setting path vars
try:
	print('Setting up path variables...')
	path = os.path.abspath(__file__) # Run the first time using python -i test.py
	dirname = os.path.dirname(path)
	src = os.path.join(dirname,'src')
	sys.path.append(src)
except:
	print('Skipped path variable setup: variables already defined.')
	# if __file__ is undefined, then the script is being run in interpreter -
	# 'path' should already be defined then

print('Setting up global environment...')
# Setting convenience Global vars
jst = os.path.join(src,'jsontrans.py') # shorthand for jsontrans module

# Setting useful Global vars
SERVER_URL = '127.0.0.1'
PORT = 8080
INDEX = ''
e = exec
PD_DEFAULTS = (0, 60, 80)

# Useful Utility Functions

# Send a request to the server and print it
def try_connect():
	r = requests.get("{}:{}/{}".format(SERVER_URL,PORT,INDEX))
	print(r.text)

def r(filename):
	with open(filename,"r") as f:
		txt = f.read()
	return txt

def pd_settings(max_cols = 0,max_rows = None,disp_width = None):

    # Set pandas display settings and retrieve old settings
    initial_max_cols = pd.get_option('display.max_columns')
    initial_max_rows = pd.get_option('display.max_rows')
    initial_width = pd.get_option('display.width')

    pd.set_option('display.max_columns', max_cols)
    pd.set_option('display.max_rows', max_rows)
    if disp_width is not None:
        pd.set_option('display.width', disp_width)
    return (initial_max_cols,initial_max_rows,initial_width)

def pd_reset():
	return pd_settings(*PD_DEFAULTS)

# Updating local modules
try:
	get_new_data.dirname = dirname # This will throw a exception unless we've already loaded the packages once
	print('Reloading packages...')
	reload(apitrans)
	reload(galreq)
	reload(globals)
	reload(jsontrans)
	reload(get_new_data)
	reload(main)
except:
	print('Loading packages...')
	import apitrans
	import galreq
	import globals
	import jsontrans
	import main
	import get_new_data
	get_new_data.dirname = dirname

# Importing resources from modules into workspace
from apitrans import get_query
from galreq import gallatin_data
from globals import *
from jsontrans import format_data
from main import run
from get_new_data import fetch_data,get_data

print('Setting display settings...')
pd_settings(0,10,50)

print('test.py was run successfully')
