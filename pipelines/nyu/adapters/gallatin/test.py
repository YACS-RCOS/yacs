import requests

SERVER_URL = '127.0.0.1'
PORT = 8080
PATH = ''

# Test script to make sure that everything is running according to plan

# Send a request to the server and print it
r = requests.get("{}:{}/{}".format(SERVER_URL,PORT,PATH))
print(r)
