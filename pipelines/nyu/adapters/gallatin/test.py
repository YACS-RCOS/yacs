import requests

SERVER_URL = '127.0.0.1'
PORT = 8080
PATH = ''

# Test script to make sure that everything is running according to plan

# Send a request to the server and print it
def try_connect():
	r = requests.get("{}:{}/{}".format(SERVER_URL,PORT,PATH))
	print(r.text)

# Get test data as if you had connected to the Gallatin API
def get_test_data():
	with open("data/data.json","r") as f:
		data = f.read()
	return data
